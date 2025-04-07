"use client";
import React from "react";

import AuthForm from "@/components/forms/AuthForm";
import { signUpWithCredentials } from "@/lib/actions/auth.actions";
import { SignUpSchema } from "@/lib/validations";

const SignUp = () => {
  return (
    <AuthForm
      formType="SIGN_UP"
      schema={SignUpSchema}
      onSubmit={signUpWithCredentials}
      defaultValues={{
        email: "",
        password: "",
        name: "",
        username: "",
      }}
    />
  );
};

export default SignUp;
