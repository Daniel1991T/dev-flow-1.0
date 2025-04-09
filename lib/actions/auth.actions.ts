"use server";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

import { signIn } from "@/auth";
import Account from "@/database/account.model";
import User from "@/database/user.model";
import { ActionResponse, ErrorResponse } from "@/types/global";

import actions from "../handlers/actions";
import handleError from "../handlers/error";
import { NotFoundError } from "../http-errors";
import { SignInSchema, SignUpSchema } from "../validations";

export async function signUpWithCredentials(
  params: AuthCredentials,
): Promise<ActionResponse> {
  const validationResult = await actions({
    params,
    schema: SignUpSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { name, username, email, password } = validationResult.params!;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingUser = await User.findOne({ email }).session(session);
    if (existingUser) {
      const existingAccount = await Account.findOne({
        provider: "credentials",
        providerAccountId: email,
      }).session(session);

      if (existingAccount) {
        throw new Error("Account already exists!");
      }

      const existingUsername = await User.findOne({ username }).session(
        session,
      );
      if (
        existingUsername &&
        existingUsername._id.toString() !== existingUser._id.toString()
      ) {
        throw new Error("Username already exists!");
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      await Account.create(
        [
          {
            userId: existingUser._id,
            name: existingUser.name || name,
            provider: "credentials",
            providerAccountId: email,
            password: hashedPassword,
          },
        ],
        { session },
      );

      await session.commitTransaction();
      await signIn("credentials", { email, password, redirect: false });

      return { success: true };
    }
    const existingUsername = await User.findOne({ username }).session(session);
    if (existingUsername) {
      throw new Error("Username already exists!");
    }
    const hasedPassword = await bcrypt.hash(password, 12);
    const [newUser] = await User.create(
      [
        {
          name,
          username,
          email,
        },
      ],
      { session },
    );
    await Account.create(
      [
        {
          userId: newUser._id,
          name,
          provider: "credentials",
          providerAccountId: email,
          password: hasedPassword,
        },
      ],
      { session },
    );
    await session.commitTransaction();
    await signIn("credentials", { email, password, redirect: false });
    return { success: true };
  } catch (error) {
    await session.abortTransaction();
    return handleError(error) as ErrorResponse;
  } finally {
    session.endSession();
  }
}

export async function signInWithCredentials(
  params: Pick<AuthCredentials, "email" | "password">,
): Promise<ActionResponse> {
  const validationResult = await actions({
    params,
    schema: SignInSchema,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { email, password } = validationResult.params!;

  try {
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      throw new NotFoundError("User");
    }

    const existingAccount = await Account.findOne({
      provider: "credentials",
      providerAccountId: email,
    });
    if (!existingAccount) {
      throw new NotFoundError("Account");
    }

    const passwordMatch = await bcrypt.compare(
      password,
      existingAccount.password,
    );
    if (!passwordMatch) {
      throw new Error("Invalid credentials!");
    }

    await signIn("credentials", { email, password, redirect: false });
    return { success: true };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
