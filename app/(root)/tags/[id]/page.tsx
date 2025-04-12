import React from "react";

import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import LocalSearch from "@/components/search/LocalSearch";
import ROUTES from "@/constants/routes";
import { UI_STATES } from "@/constants/states";
import { GetTagQuestions } from "@/lib/actions/tag.actions";
import { RouteParams } from "@/types/global";

const TagPage = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { query, page, pageSize } = await searchParams;

  const { success, data, error } = await GetTagQuestions({
    tagId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    query: query || "",
  });

  const { tag, questions } = data || {};
  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900 capitalize">
          {tag?.name}
        </h1>
      </section>
      <section className="mt-11">
        <LocalSearch
          route={ROUTES.TAG(id)}
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
        />
      </section>
      <DataRenderer
        success={success}
        error={error}
        data={questions}
        empty={UI_STATES.EMPTY_QUESTION}
        render={(questions) => (
          <div className="mt-10 flex w-full flex-col gap-6">
            {questions.map((question) => (
              <QuestionCard key={question._id} question={question} />
            ))}
          </div>
        )}
      />
    </>
  );
};
export default TagPage;
