const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  COMMUNITY: "/community",
  COLLECTION: "/collection",
  JOBS: "/find-jobs",
  TAGS: "/tags",
  TAG: (id: string) => `/tags/${id}`,
  PROFILE: (id: string) => `/profile/${id}`,
  QUESTION: (id: string) => `/question/${id}`,
  ASK_QUESTION: "/ask-question",
  SIGN_IN_WITH_OAUTH: "/signin-with-oauth",
  NOT_FOUND: "/404",
};

export default ROUTES;
