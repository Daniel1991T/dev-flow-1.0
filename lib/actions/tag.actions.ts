import { FilterQuery } from "mongoose";

import { FILTER_TAG } from "@/constants/filter";
import { HTTP_STATUS_CODE } from "@/constants/httpStatusCode";
import { Question as QuestionModel, Tag } from "@/database";
import {
  ActionResponse,
  ErrorResponse,
  PaginatedSearchParams,
  Question,
  Tag as TagType,
} from "@/types/global";

import actions from "../handlers/actions";
import handleError from "../handlers/error";
import { NotFoundError } from "../http-errors";
import {
  GetTagQuestionsSchema,
  PaginatedSearchParamsSchema,
} from "../validations";

export const getTags = async (
  params: PaginatedSearchParams,
): Promise<ActionResponse<{ tags: TagType[]; isNext: boolean }>> => {
  const validationResult = await actions({
    params,
    schema: PaginatedSearchParamsSchema,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { page = 1, pageSize = 10, query, filter } = params;
  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  const filterQuery: FilterQuery<typeof Tag> = {};
  if (query) {
    filterQuery.$or = [{ name: { $regex: query, $options: "i" } }];
  }
  let sortCriteria = {};
  switch (filter) {
    case FILTER_TAG.POPULAR:
      sortCriteria = { questions: -1 };
      break;
    case FILTER_TAG.RECENT:
      sortCriteria = { createdAt: -1 };
      break;
    case FILTER_TAG.OLDEST:
      sortCriteria = { createdAt: 1 };
      break;
    case FILTER_TAG.NAME:
      sortCriteria = { name: 1 };
      break;
    default:
      sortCriteria = { questions: -1 };
      break;
  }

  try {
    const totalTags = await Tag.countDocuments(filterQuery);
    const tags = await Tag.find(filterQuery)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);
    const isNext = totalTags > skip + tags.length;
    return {
      status: HTTP_STATUS_CODE.OK,
      success: true,
      data: {
        tags: JSON.parse(JSON.stringify(tags)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};

export const GetTagQuestions = async (
  params: GetTagQuestions,
): Promise<
  ActionResponse<{ tag: TagType; questions: Question[]; isNext: boolean }>
> => {
  const validationResult = await actions({
    params,
    schema: GetTagQuestionsSchema,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { page = 1, pageSize = 10, query, tagId } = params;
  const skip = (Number(page) - 1) * Number(pageSize);
  const limit = Number(pageSize);

  try {
    const tag = await Tag.findById(tagId);
    if (!tag) throw new NotFoundError("Tag");
    const filterQuery: FilterQuery<typeof QuestionModel> = {
      tags: { $in: [tagId] },
    };
    if (query) {
      filterQuery.title = { $regex: query, $options: "i" };
    }
    const totalQuestion = await QuestionModel.countDocuments(filterQuery);
    const questions = await QuestionModel.find(filterQuery)
      .select("_id title views answers upvote downvote author createdAt")
      .populate([
        { path: "author", select: "name image" },
        { path: "tags", select: "name" },
      ])
      .skip(skip)
      .limit(limit);

    const isNext = totalQuestion > skip + questions.length;
    return {
      status: HTTP_STATUS_CODE.OK,
      success: true,
      data: {
        tag: JSON.parse(JSON.stringify(tag)),
        questions: JSON.parse(JSON.stringify(questions)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
};
