import clsx from "clsx";
import Image from "next/image";
import React from "react";

type LogoProps = {
  textClassName?: string;
};

function Logo({ textClassName }: LogoProps) {
  return (
    <>
      <Image
        src="/images/site-logo.svg"
        width={23}
        height={23}
        alt="DevFlow Logo"
      />
      <p
        className={clsx(
          "h2-bold font-space-grotesk text-dark-100 dark:text-light-900",
          textClassName,
        )}
      >
        Dev<span className="text-primary-500">Flow</span>
      </p>
    </>
  );
}

export default Logo;
