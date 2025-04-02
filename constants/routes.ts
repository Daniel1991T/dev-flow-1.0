const ROUTES = {
  HOME: "/",
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  COMUNITY: "/community",
  COLLECTION: "/collection",
  JOBS: "/find-jobs",
  TAGS: "/tags",
  TAG: (id: string) => `/tags/${id}`,
  PROFILE: (id: string) => `/profile/${id}`,
  ASK_QUESTION: "/ask-a-question",
};

export default ROUTES;
