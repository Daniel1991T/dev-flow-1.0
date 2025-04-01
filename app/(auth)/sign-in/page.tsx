"use client";
import React from "react";

import AuthForm from "@/components/forms/AuthForm";
import { SignInSchema } from "@/lib/validations";

const SignIn = () => {
  return (
    <AuthForm
      formType="SIGN_IN"
      schema={SignInSchema}
      onSubmit={(data) =>
        Promise.resolve({
          success: true,
          data,
        })
      }
      defaultValues={{
        email: "",
        password: "",
      }}
    />
  );
};

export default SignIn;
