import ROUTES from "@/constants/routes";
import { TAccount } from "@/database/account.model";
import { TUser } from "@/database/user.model";

import { fetchHandler } from "./handlers/fetch";

const AIP_BASE_URL =
  process.env.NEXT_PUBLIC_AIP_BASE_URL || "http://localhost:3000/api";

export const api = {
  auth: {
    oAuthSignIn: ({
      user,
      provider,
      providerAccountId,
    }: SignInWithOAuthParams) =>
      fetchHandler(`${AIP_BASE_URL}/auth/${ROUTES.SIGN_IN_WITH_OAUTH}`, {
        method: "POST",
        body: JSON.stringify({
          user,
          provider,
          providerAccountId,
        }),
      }),
  },
  users: {
    getAll: () => fetchHandler(`${AIP_BASE_URL}/users`),
    getById: (id: string) => fetchHandler(`${AIP_BASE_URL}/users/${id}`),
    getByEmail: (email: string) =>
      fetchHandler(`${AIP_BASE_URL}/users/email/`, {
        method: "POST",
        body: JSON.stringify({ email }),
      }),
    create: (userData: Partial<TUser>) =>
      fetchHandler(`${AIP_BASE_URL}/users`, {
        method: "POST",
        body: JSON.stringify(userData),
      }),
    update: (id: string, userData: Partial<TUser>) =>
      fetchHandler(`${AIP_BASE_URL}/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(userData),
      }),
    delete: (id: string) =>
      fetchHandler(`${AIP_BASE_URL}/users/${id}`, {
        method: "DELETE",
      }),
  },
  account: {
    getAll: () => fetchHandler(`${AIP_BASE_URL}/accounts`),
    getById: (id: string) => fetchHandler(`${AIP_BASE_URL}/accounts/${id}`),
    getByProvider: (providerAccountId: string) =>
      fetchHandler(`${AIP_BASE_URL}/accounts/provider`, {
        method: "POST",
        body: JSON.stringify({ providerAccountId }),
      }),
    create: (accountData: Partial<TAccount>) =>
      fetchHandler(`${AIP_BASE_URL}/accounts`, {
        method: "POST",
        body: JSON.stringify(accountData),
      }),
    update: (id: string, accountData: Partial<TAccount>) =>
      fetchHandler(`${AIP_BASE_URL}/accounts/${id}`, {
        method: "PUT",
        body: JSON.stringify(accountData),
      }),
    delete: (id: string) =>
      fetchHandler(`${AIP_BASE_URL}/accounts/${id}`, {
        method: "DELETE",
      }),
  },
};
