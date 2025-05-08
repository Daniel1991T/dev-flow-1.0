"use server";

import mongosse from "mongoose";
import { revalidatePath } from "next/cache";

import { HTTP_STATUS_CODE } from "@/constants/httpStatusCode";
import ROUTES from "@/constants/routes";
import { Question } from "@/database";
import Answer, { TAnswerDoc } from "@/database/answer.model";
import { ActionResponse, ErrorResponse } from "@/types/global";

import actions from "../handlers/actions";
import handleError from "../handlers/error";
import { AnswerServerShema } from "../validations";

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
