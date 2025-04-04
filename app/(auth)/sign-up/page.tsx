"use client";
import React from "react";

import AuthForm from "@/components/forms/AuthForm";
import { SignUpSchema } from "@/lib/validations";

const SignUp = () => {
  return (
    <AuthForm
      formType="SIGN_UP"
      schema={SignUpSchema}
      onSubmit={(data) =>
        Promise.resolve({
          success: true,
          data,
        })
      }
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
