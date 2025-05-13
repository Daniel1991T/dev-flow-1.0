import Image from "next/image";
import Link from "next/link";
import React from "react";

import { UI_STATES } from "@/constants/states";

import { Button } from "./ui/button";

type UIState = (typeof UI_STATES)[keyof typeof UI_STATES];

type DataRendererProps<T> = {
  success: boolean;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  data: T[] | null | undefined;
  empty: UIState;
  render: (data: T[]) => React.ReactNode;
};

type StateSkeletonProps = {
  image: {
    light: string;
    dark: string;
    alt: string;
  };
  title: string;
  message: string;
  button?: {
    text?: string;
    href?: string;
  };
};

const StateSkeleton = ({
  image,
  title,
  message,
  button,
}: StateSkeletonProps) => (
  <div className="mt-16 flex flex-col items-center justify-center sm:mt-36">
    <>
      <Image
        src={image.dark}
        alt={image.alt}
        width={270}
        height={200}
        className="hidden object-contain dark:block"
      />
      <Image
        src={image.light}
        alt={image.alt}
        width={270}
        height={200}
        className="object-contain dark:hidden"
      />
    </>
    <h2 className="h2-bold text-dark200_light900 mt-8">{title}</h2>
    <p className="body-regular text-dark500_light700 my-3.5 max-w-md text-center">
      {message}
    </p>
    {button ? (
      <Link href={button.href!}>
        <Button className="paragraph-medium mt-5 min-h-[46px] rounded-lg bg-primary-500 px-4 py-3 text-light-900 hover:bg-primary-500">
          {button.text}
        </Button>
      </Link>
    ) : null}
  </div>
);

const DataRenderer = <T,>({
  success,
  error,
  data,
  empty = UI_STATES.DEFAULT_EMPTY,
  render,
}: DataRendererProps<T>) => {
  if (!success) {
    return (
      <StateSkeleton
        image={{
          light: "/images/light-error.png",
          dark: "/images/dark-error.png",
          alt: "Error state illustration",
        }}
        title={error?.message || UI_STATES.DEFAULT_ERROR.title}
        message={
          error?.details
            ? JSON.stringify(error.details, null, 2)
            : UI_STATES.DEFAULT_ERROR.message
        }
        button={UI_STATES.DEFAULT_ERROR.button}
      />
    );
  }

  if (!data || data.length === 0) {
    return (
      <StateSkeleton
        image={{
          light: "/images/light-illustration.png",
          dark: "/images/dark-illustration.png",
          alt: "Empty state illustration",
        }}
        title={empty.title}
        message={empty.message}
        button={"button" in empty ? empty.button : undefined}
      />
    );
  }
  return <>{render(data)}</>;
};

export default DataRenderer;
