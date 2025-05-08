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
  content: string;
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

type RouteParams = {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
};

type PaginatedSearchParams = {
  page?: number;
  pageSize?: number;
  query?: string;
  filter?: string;
  sort?: string;
};

type Answer = {
  _id: string;
  content: string;
  author: Author;
  createdAt: Date;
};
