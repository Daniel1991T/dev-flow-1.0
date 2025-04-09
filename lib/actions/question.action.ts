"use server";
import mongoose from "mongoose";

import { HTTP_STATUS_CODE } from "@/constants/httpStatusCode";
import Question from "@/database/question.model";
import TagQuestion from "@/database/tag-question.model";
import Tag, { TTagDoc } from "@/database/tag.model";
import {
  ActionResponse,
  ErrorResponse,
  Question as TQuestion,
} from "@/types/global";

import actions from "../handlers/actions";
import handleError from "../handlers/error";
import { NotFoundError, UnauthorizedError } from "../http-errors";
import {
  AskQuestionSchema,
  EditQuestionSchema,
  GetQuestionSchema,
} from "../validations";

export async function createQuestion(
  params: CreateQuestionParams,
): Promise<ActionResponse<TQuestion>> {
  const validationResult = await actions({
    params,
    schema: AskQuestionSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { title, content, tags } = validationResult.params!;
  const userId = validationResult.session?.user?.id;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const [question] = await Question.create(
      [{ title, content, author: userId }],
      { session },
    );
    if (!question) {
      throw new Error("Failed to create question");
    }
    const tagIds: mongoose.Types.ObjectId[] = [];
    const tagQuestionsDocuments = [];
    for (const tag of tags) {
      const existingTag = await Tag.findOneAndUpdate(
        { name: { $regex: new RegExp(`^${tag}$`, "i") } },
        { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
        { upsert: true, new: true, session },
      );
      tagIds.push(existingTag._id);
      tagQuestionsDocuments.push({
        tag: existingTag._id,
        question: question._id,
      });
    }
    await TagQuestion.insertMany(tagQuestionsDocuments, { session });
    await Question.findByIdAndUpdate(
      question._id,
      { $push: { tags: { $each: tagIds } } },
      { session },
    );
    await session.commitTransaction();
    return {
      success: true,
      status: HTTP_STATUS_CODE.CREATED,
      data: JSON.parse(JSON.stringify(question)),
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}

export async function editQuestion(
  params: EditQuestionParams,
): Promise<ActionResponse<TQuestion>> {
  const validationResult = await actions({
    params,
    schema: EditQuestionSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { title, content, tags, questionId } = validationResult.params!;
  const userId = validationResult.session?.user?.id;
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const question = await Question.findById(questionId).populate("tags");
    if (!question) {
      throw new Error("Question not found");
    }

    if (question.author.toString() !== userId) {
      throw new UnauthorizedError(
        "You are not authorized to edit this question",
      );
    }

    if (question.title !== title || question.content !== content) {
      question.content = content;
      question.title = title;
      await question.save({ session });
    }

    const tagsToAdd = tags.filter(
      (tag) => !question.tags.includes(tag.toLowerCase()),
    );
    const tagsToRemove = question.tags.filter(
      (tag: TTagDoc) => !tags.includes(tag.name.toLowerCase()),
    );

    const newTagDocuments = [];
    if (tagsToAdd.length > 0) {
      for (const tag of tagsToAdd) {
        const existingTag = await Tag.findOneAndUpdate(
          { name: { $regex: new RegExp(`^${tag}$`, "i") } },
          { $setOnInsert: { name: tag }, $inc: { questions: 1 } },
          { upsert: true, new: true, session },
        );
        if (existingTag) {
          newTagDocuments.push({
            tag: existingTag._id,
            question: questionId,
          });
          question.tags.push(existingTag._id);
        }
      }
    }

    if (tagsToRemove.length > 0) {
      const tagIdsToRemove = tagsToRemove.map((tag: TTagDoc) => tag._id);

      await Tag.updateMany(
        { _id: { $in: tagIdsToRemove } },
        { $inc: { questions: -1 } },
        { session },
      );
      await TagQuestion.deleteMany(
        {
          tag: { $in: tagIdsToRemove },
          question: questionId,
        },
        { session },
      );
      question.tags = question.tags.filter(
        (tag: mongoose.Types.ObjectId) => !tagIdsToRemove.includes(tag._id),
      );
    }
    if (newTagDocuments.length > 0) {
      await TagQuestion.insertMany(newTagDocuments, { session });
    }
    await question.save({ session });
    await session.commitTransaction();
    return {
      success: true,
      status: HTTP_STATUS_CODE.OK,
      data: JSON.parse(JSON.stringify(question)),
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}

export async function getQuestion(
  params: GetQuestionParams,
): Promise<ActionResponse<TQuestion>> {
  const validationResult = await actions({
    params,
    schema: GetQuestionSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { questionId } = validationResult.params!;

  try {
    const question = await Question.findById(questionId).populate("tags");
    if (!question) {
      throw new NotFoundError("Question");
    }
    return {
      success: true,
      status: HTTP_STATUS_CODE.OK,
      data: JSON.parse(JSON.stringify(question)),
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
