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
