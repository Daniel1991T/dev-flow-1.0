import Link from "next/link";

import QuestionCard from "@/components/cards/QuestionCard";
import DataRenderer from "@/components/DataRenderer";
import HomeFilter from "@/components/filters/HomeFilter";
import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import { UI_STATES } from "@/constants/states";
import { getQuestions } from "@/lib/actions/question.action";

type SearchParams = {
  searchParams: Promise<{ [key: string]: string }>;
};

const Home = async ({ searchParams }: SearchParams) => {
  const { query, filter, page, pageSize } = await searchParams;
  const { success, data, error } = await getQuestions({
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    filter: filter || "",
    query: query || "",
  });

  const { questions } = data || {};

  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>

        <Button
          className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900"
          asChild
        >
          <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
        </Button>
      </section>
      <section className="mt-11">
        <LocalSearch
          route={ROUTES.HOME}
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
        />
      </section>
      <HomeFilter />
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
      {/* // {success ? (
      //   <div className="mt-10 flex w-full flex-col gap-6">
      //     {questions && questions.length > 0 ? (
      //       questions.map((question) => (
      //         <QuestionCard key={question._id} question={question} />
      //       ))
      //     ) : (
      //       <div className="mt-10 flex w-full items-center justify-center">
      //         <p className="text-dark400_light700">No questions found!</p>
      //       </div>
      //     )}
      //   </div>
      // ) : (
      //   <div className="mt-10 flex w-full items-center justify-center">
      //     <p className="text-dark400_light700">
      //       {error?.message || "Failed to fetch questions!"}
      //     </p>
      //   </div>
      // )} */}
    </>
  );
};

export default Home;
