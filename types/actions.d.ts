import { PaginatedSearchParams } from "./global";

type SignInWithOAuthParams = {
  provider: "google" | "github";
  providerAccountId: string;
  user: {
    name: string;
    email: string;
    image?: string;
    username: string;
  };
};

type AuthCredentials = {
  name: string;
  username: string;
  email: string;
  password: string;
};

type CreateQuestionParams = {
  title: string;
  content: string;
  tags: string[];
};

type EditQuestionParams = {
  questionId: string;
} & CreateQuestionParams;

type GetQuestionParams = {
  questionId: string;
};

type GetTagQuestions = {
  tagId: string;
} & Omit<PaginatedSearchParams, "filter">;

type IncrementViewsParams = {
  questionId: string;
};

type CreateAnswerParams = {
  questionId: string;
  content: string;
};

type GetAnswersParams = {
  questionId: string;
} & PaginatedSearchParams;

type CreateVoteParams = {
  targetId: string;
  targetType: "question" | "answer";
  voteType: "upvote" | "downvote";
};

type UpdateVoteCountParams = {
  change: 1 | -1;
} & CreateVoteParams;

type HasVotedParams = Pick<CreateVoteParams, "targetId" | "targetType">;

type HasVotedResponse = {
  hasUpvoted: boolean;
  hasDownvoted: boolean;
};
