"use client";
import React from "react";

import AuthForm from "@/components/forms/AuthForm";
import { signInWithCredentials } from "@/lib/actions/auth.actions";
import { SignInSchema } from "@/lib/validations";

const SignIn = () => {
  return (
    <AuthForm
      formType="SIGN_IN"
      schema={SignInSchema}
      onSubmit={signInWithCredentials}
      defaultValues={{
        email: "",
        password: "",
      }}
    />
  );
};

export default SignIn;
