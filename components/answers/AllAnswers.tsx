import { UI_STATES } from "@/constants/states";
import { ActionResponse, Answer } from "@/types/global";

import AnswerCard from "../cards/AnswerCard";
import DataRenderer from "../DataRenderer";

interface AllAnswersProps extends ActionResponse<Answer[]> {
  totalAnswers: number | undefined;
}

const AllAnswers = ({
  success,
  data,
  error,
  totalAnswers = 0,
}: AllAnswersProps) => {
  return (
    <div className="mt-11">
      <div className="flex items-center justify-between">
        <h3 className="primary-text-gradient">
          {totalAnswers} {totalAnswers === 1 ? "Answer" : "Answers"}
        </h3>
        <p>Filters</p>
      </div>
      <DataRenderer
        data={data}
        success={success}
        error={error}
        empty={UI_STATES.EMPTY_ANSWERS}
        render={(answers) =>
          answers.map((answer) => <AnswerCard key={answer._id} {...answer} />)
        }
      />
    </div>
  );
};

export default AllAnswers;
