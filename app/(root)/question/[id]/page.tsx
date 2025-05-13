import Link from "next/link";
import { redirect } from "next/navigation";
// eslint-disable-next-line camelcase
import { unstable_after } from "next/server";
import React from "react";

import AllAnswers from "@/components/answers/AllAnswers";
import TagCard from "@/components/cards/TagCard";
import Preview from "@/components/editor/Preview";
import AnswerForm from "@/components/forms/AnswerForm";
import Metric from "@/components/Metric";
import UserAvatar from "@/components/UserAvatar";
import Votes from "@/components/votes/Votes";
import { FILTER_ANSWERS } from "@/constants/filter";
import ROUTES from "@/constants/routes";
import { getAnswers } from "@/lib/actions/answer.actions";
import { getQuestion, incrementViews } from "@/lib/actions/question.action";
import { formatNumber, getTimeStamp } from "@/lib/utils";
import { RouteParams } from "@/types/global";

const QuestionDetails = async ({ params }: RouteParams) => {
  const { id } = await params;

  const { success, data: question } = await getQuestion({ questionId: id });

  unstable_after(async () => {
    await incrementViews({ questionId: id });
  });

  if (!success || !question) return redirect(ROUTES.NOT_FOUND);
  const {
    success: AreAnswersLoaded,
    data: answersResult,
    error: answersError,
  } = await getAnswers({
    questionId: question._id,
    page: 1,
    pageSize: 10,
    filter: FILTER_ANSWERS.LATEST,
  });
  console.log(answersResult);

  const { answers, author, content, createdAt, tags, title, views } = question;
  return (
    <>
      <div className="flex-start w-full flex-col">
        <div className="flex w-full flex-col-reverse justify-between">
          <div className="flex items-center justify-start gap-1">
            <UserAvatar
              id={author._id}
              name={author.name}
              className="size-[20px]"
              fallbackClassName="text-[10px]"
            />
            <Link href={ROUTES.PROFILE(author._id)}>
              <p className="paragraph-semibold text-dark300_light700">
                {author.name}
              </p>
            </Link>
          </div>
          <div className="flex justify-end">
            <Votes
              upvotes={question.upvotes}
              downvotes={question.downvotes}
              hasupVote={false}
              hasdownVote={true}
            />
          </div>
        </div>
        <h2 className="h2-semibold text-dark200_light900 mt-3.5 w-full">
          {title}
        </h2>
      </div>
      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/icons/clock.svg"
          alt="clock icon"
          value={` asked ${getTimeStamp(new Date(createdAt))}`}
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/message.svg"
          alt="message icon"
          value={answers}
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/eye.svg"
          alt="eye icon"
          value={formatNumber(views)}
          textStyles="small-regular text-dark400_light700"
        />
      </div>
      <Preview content={content} />
      <div className="mt-8 flex flex-wrap gap-2">
        {tags.map((tag) => (
          <TagCard
            _id={tag._id as string}
            key={tag._id}
            name={tag.name}
            compact
          />
        ))}
      </div>
      <section className="my-5">
        <AnswerForm questionId={question._id} />
      </section>
      <section className="my-5">
        <AllAnswers
          data={answersResult?.answers}
          success={AreAnswersLoaded}
          error={answersError}
          totalAnswers={answersResult?.totalAnswers}
        />
      </section>
    </>
  );
};

export default QuestionDetails;
