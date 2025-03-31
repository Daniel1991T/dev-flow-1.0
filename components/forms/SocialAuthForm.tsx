"use client";
import clsx from "clsx";
import Image from "next/image";
import { signIn } from "next-auth/react";
import React from "react";

import ROUTES from "@/constants/routes";
import { toast } from "@/hooks/use-toast";

import { Button } from "../ui/button";

const SocialAuthForm = () => {
  const handleSignIn = async (provider: "github" | "google") => {
    try {
      await signIn(provider, {
        callbackUrl: ROUTES.HOME,
        redirect: false,
      });
    } catch (error) {
      console.log(error);
      toast({
        title: "Sign-in Failed",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred during sign-in.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="mt-10 flex flex-wrap gap-2.5">
      <SocialButton
        srcImg="/icons/github.svg"
        altImg="Github Logo"
        title="Log in with Github"
        imageClassName="invert-colors"
        handleSignIn={handleSignIn}
        provider="github"
      />
      <SocialButton
        srcImg="/icons/google.svg"
        altImg="Google Logo"
        title="Log in with Google"
        handleSignIn={handleSignIn}
        provider="google"
      />
    </div>
  );
};

type SocialButtonProps = {
  srcImg: string;
  altImg: string;
  imageClassName?: string;
  title: string;
  handleSignIn: (provider: "github" | "google") => void;
  provider: "google" | "github";
};

const SocialButton = ({
  srcImg,
  altImg,
  imageClassName,
  title,
  handleSignIn,
  provider,
}: SocialButtonProps) => {
  return (
    <Button
      className="background-dark400_light900 body-medium text-dark200_light800 min-h-12 flex-1 rounded-2 px-4 py-3.5"
      onClick={() => handleSignIn(provider)}
    >
      <Image
        src={srcImg}
        alt={altImg}
        width={20}
        height={20}
        className={clsx(imageClassName, "mr-2.5 object-contain")}
      />
      <span>{title}</span>
    </Button>
  );
};

export default SocialAuthForm;
