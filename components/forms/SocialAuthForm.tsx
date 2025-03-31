import clsx from "clsx";
import Image from "next/image";
import React from "react";

import { Button } from "../ui/button";

const SocialAuthForm = () => {
  return (
    <div className="mt-10 flex flex-wrap gap-2.5">
      <SocialButton
        srcImg="/icons/github.svg"
        altImg="Github Logo"
        title="Log in with Github"
        imageClassName="invert-colors"
      />
      <SocialButton
        srcImg="/icons/google.svg"
        altImg="Google Logo"
        title="Log in with Google"
      />
    </div>
  );
};

type SocialButtonProps = {
  srcImg: string;
  altImg: string;
  imageClassName?: string;
  title: string;
};

const SocialButton = ({
  srcImg,
  altImg,
  imageClassName,
  title,
}: SocialButtonProps) => {
  return (
    <Button className="background-dark400_light900 body-medium text-dark200_light800 min-h-12 flex-1 rounded-2 px-4 py-3.5">
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
