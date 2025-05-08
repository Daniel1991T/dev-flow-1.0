"use server";

import mongosse from "mongoose";
import { revalidatePath } from "next/cache";

import { FILTER_ANSWERS } from "@/constants/filter";
import { HTTP_STATUS_CODE } from "@/constants/httpStatusCode";
import ROUTES from "@/constants/routes";
import { Question } from "@/database";
import Answer, { TAnswerDoc } from "@/database/answer.model";
import { CreateAnswerParams, GetAnswersParams } from "@/types/actions";
import {
  ActionResponse,
  Answer as TAnswer,
  ErrorResponse,
} from "@/types/global";

import actions from "../handlers/actions";
import handleError from "../handlers/error";
import { AnswerServerShema, GetAnswersParamsSchema } from "../validations";

export async function createAnswer(
  params: CreateAnswerParams,
): Promise<ActionResponse<TAnswerDoc>> {
  const validationResult = await actions({
    params,
    schema: AnswerServerShema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { content, questionId } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  const session = await mongosse.startSession();
  session.startTransaction();

  try {
    const question = await Question.findById(questionId);
    if (!question) {
      throw new Error("Question not found");
    }
    const [newAnswer] = await Answer.create(
      [
        {
          content,
          question: questionId,
          author: userId,
        },
      ],
      { session },
    );
    if (!newAnswer) {
      throw new Error("Failed to create answer");
    }
    question.answers += 1;
    await question.save({ session });
    await session.commitTransaction();
    revalidatePath(ROUTES.QUESTION(questionId));
    return {
      success: true,
      status: HTTP_STATUS_CODE.CREATED,
      data: JSON.parse(JSON.stringify(newAnswer)),
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error as Error) as ErrorResponse;
  } finally {
    await session.endSession();
  }
}

export async function getAnswers(
  params: GetAnswersParams,
): Promise<
  ActionResponse<{ answers: TAnswer[]; isNext: boolean; totalAnswers: number }>
> {
  const validationResult = await actions({
    params,
    schema: GetAnswersParamsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const {
    page = 1,
    pageSize = 10,
    filter,
    questionId,
  } = validationResult.params!;
  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  let sortCriteria = {};

  switch (filter) {
    case FILTER_ANSWERS.LATEST:
      sortCriteria = { createdAt: -1 };
      break;
    case FILTER_ANSWERS.OLDEST:
      sortCriteria = { createdAt: 1 };
      break;
    case FILTER_ANSWERS.POPULAR:
      sortCriteria = { upvotes: -1 };
      break;
    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const totalAnswers = await Answer.countDocuments({ question: questionId });
    const answers = await Answer.find({ question: questionId })
      .populate("author", "_id name image")
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);
    const isNext = totalAnswers > skip + answers.length;

    return {
      success: true,
      status: HTTP_STATUS_CODE.OK,
      data: {
        answers: JSON.parse(JSON.stringify(answers)),
        isNext,
        totalAnswers,
      },
    };
  } catch (error) {
    return handleError(error as Error) as ErrorResponse;
  }
}
