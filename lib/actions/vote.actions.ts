"use server";

import mongoose, { ClientSession } from "mongoose";
import { revalidatePath } from "next/cache";

import { HTTP_STATUS_CODE } from "@/constants/httpStatusCode";
import ROUTES from "@/constants/routes";
import { Answer, Question, Vote } from "@/database";
import {
  CreateVoteParams,
  HasVotedParams,
  HasVotedResponse,
  UpdateVoteCountParams,
} from "@/types/actions";
import { ActionResponse, ErrorResponse } from "@/types/global";

import actions from "../handlers/actions";
import handleError from "../handlers/error";
import {
  CreateVoteSchema,
  HasVotedSchema,
  UpdateVoteCountSchema,
} from "../validations";

export async function updateVoteCount(
  params: UpdateVoteCountParams,
  session?: ClientSession,
): Promise<ActionResponse> {
  const validationResult = await actions({
    params,
    schema: UpdateVoteCountSchema,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { targetId, targetType, voteType, change } = validationResult.params!;

  const Model = targetType === "question" ? Question : Answer;
  const voteField = voteType === "upvote" ? "upvotes" : "downvotes";
  console.log("vote type", voteField);

  try {
    const result = await Model.findByIdAndUpdate(
      targetId,
      { $inc: { [voteField]: change } },
      { new: true, session },
    );
    if (!result)
      return handleError(
        new Error("Failed to update vote count"),
      ) as ErrorResponse;

    return {
      success: true,
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function createVote(
  params: CreateVoteParams,
): Promise<ActionResponse> {
  const validationResult = await actions({
    params,
    schema: CreateVoteSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { targetId, targetType, voteType } = validationResult.params!;
  const userId = validationResult.session?.user?.id;
  if (!userId) return handleError(new Error("Unauthorized")) as ErrorResponse;

  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const existingVote = await Vote.findOne({
      author: userId,
      id: targetId,
      type: targetType,
    }).session(session);
    if (existingVote) {
      if (existingVote.voteType === voteType) {
        await Vote.deleteOne({
          _id: existingVote._id,
        }).session(session);
        await updateVoteCount(
          {
            targetId,
            targetType,
            voteType,
            change: -1,
          },
          session,
        );
      } else {
        await Vote.findByIdAndUpdate(
          existingVote._id,
          { voteType },
          { new: true, session },
        );
        await updateVoteCount(
          {
            targetId,
            targetType,
            voteType: existingVote.voteType,
            change: -1,
          },
          session,
        );
        await updateVoteCount(
          {
            targetId,
            targetType,
            voteType,
            change: 1,
          },
          session,
        );
      }
    } else {
      await Vote.create(
        [
          {
            author: userId,
            id: targetId,
            type: targetType,
            voteType,
          },
        ],
        { session },
      );
      await updateVoteCount(
        {
          targetId,
          targetType,
          voteType,
          change: 1,
        },
        session,
      );
    }
    await session.commitTransaction();
    revalidatePath(ROUTES.QUESTION(targetId));
    return {
      status: HTTP_STATUS_CODE.OK,
      success: true,
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function hasVoted(
  params: HasVotedParams,
): Promise<ActionResponse<HasVotedResponse>> {
  const validationResult = await actions({
    params,
    schema: HasVotedSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { targetId, targetType } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  try {
    const vote = await Vote.findOne({
      author: userId,
      id: targetId,
      type: targetType,
    });
    console.log(vote);

    if (!vote) {
      return {
        success: false,
        status: HTTP_STATUS_CODE.OK,
        data: {
          hasUpvoted: false,
          hasDownvoted: false,
        },
      };
    }
    console.log(vote);

    return {
      success: true,
      status: HTTP_STATUS_CODE.OK,
      data: {
        hasUpvoted: vote.voteType === "upvote",
        hasDownvoted: vote.voteType === "downvote",
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
