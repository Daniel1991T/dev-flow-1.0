import { NextResponse } from "next/server";

type Tag = {
  _id: string;
  name: string;
};

type Author = {
  _id: string;
  name: string;
  image: string;
};

type Question = {
  _id: string;
  title: string;
  description?: string;
  tags: Tag[];
  author: Author;
  createdAt: Date;
  upvotes: number;
  answers: number;
  views: number;
};

type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
};

type SuccessResponse<T = null> = ActionResponse<T> & { success: true };

type ErrorResponse = ActionResponse<undefined> & { success: false };

type APIErrorResponse = NextResponse<ErrorResponse>;

type APIResponse<T = null> = NextResponse<SuccessResponse<T> | ErrorResponse>;

export {
  Tag,
  Author,
  Question,
  ActionResponse,
  SuccessResponse,
  ErrorResponse,
  APIErrorResponse,
  APIResponse,
};
