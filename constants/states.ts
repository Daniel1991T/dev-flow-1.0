import ROUTES from "./routes";

// export type UiStatePresent = {
//   title: string;
//   message: string;
//   button?: {
//     text: string;
//     href: string;
//   };
// };

export const UI_STATES = {
  DEFAULT_EMPTY: {
    title: "No Data Found",
    message:
      "Looks like the database is taking a nap. Wake it up with some new entries.",
    button: {
      text: "Add Data",
      href: ROUTES.HOME,
    },
  },
  DEFAULT_ERROR: {
    title: "Oops! Something Went Wrong",
    message: "Even our code can have a bad day. Give it another shot.",
    button: {
      text: "Retry Request",
      href: ROUTES.HOME,
    },
  },
  EMPTY_QUESTION: {
    title: "Ahh, No Questions Yet!",
    message:
      "The question board is empty. Maybe it’s waiting for your brilliant question to get things rolling",
    button: {
      text: "Ask a Question",
      href: ROUTES.ASK_QUESTION,
    },
  },
  EMPTY_TAGS: {
    title: "No Tags Found",
    message: "The tag cloud is empty. Add some keywords to make it rain.",
    button: {
      text: "Create Tag",
      href: ROUTES.TAGS,
    },
  },
  EMPTY_COLLECTIONS: {
    title: "Collections Are Empty",
    message:
      "Looks like you haven’t created any collections yet. Start curating something extraordinary today",
    button: {
      text: "Save to Collection",
      href: ROUTES.COLLECTION,
    },
  },
  EMPTY_ANSWERS: {
    title: "No Answers Yet!",
    message:
      "The answer board is empty. Make it rain with your brilliant answer!",
  },
} as const;

// export const DEFAULT_EMPTY = {
//   title: "No Data Found",
//   message:
//     "Looks like the database is taking a nap. Wake it up with some new entries.",
//   button: {
//     text: "Add Data",
//     href: ROUTES.HOME,
//   },
// };

// export const DEFAULT_ERROR = {
//   title: "Oops! Something Went Wrong",
//   message: "Even our code can have a bad day. Give it another shot.",
//   button: {
//     text: "Retry Request",
//     href: ROUTES.HOME,
//   },
// };

// export const EMPTY_QUESTION = {
//   title: "Ahh, No Questions Yet!",
//   message:
//     "The question board is empty. Maybe it’s waiting for your brilliant question to get things rolling",
//   button: {
//     text: "Ask a Question",
//     href: ROUTES.ASK_QUESTION,
//   },
// };

// export const EMPTY_TAGS = {
//   title: "No Tags Found",
//   message: "The tag cloud is empty. Add some keywords to make it rain.",
//   button: {
//     text: "Create Tag",
//     href: ROUTES.TAG,
//   },
// };

// export const EMPTY_COLLECTIONS = {
//   title: "Collections Are Empty",
//   message:
//     "Looks like you haven’t created any collections yet. Start curating something extraordinary today",
//   button: {
//     text: "Save to Collection",
//     href: ROUTES.COLLECTION,
//   },
// };
