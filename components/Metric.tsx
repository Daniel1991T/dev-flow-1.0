import Image from "next/image";
import Link from "next/link";
import React from "react";

import { cn } from "@/lib/utils";

type MetricProps = {
  imgUrl: string;
  alt: string;
  value: number | string;
  title?: string;
  href?: string;
  textStyles: string;
  imgStyles?: string;
  isAutor?: boolean;
  titleStyles?: string;
};

const Metric = ({
  imgUrl,
  alt,
  href,
  imgStyles,
  textStyles,
  title,
  value,
  titleStyles,
}: MetricProps) => {
  const metricContent = (
    <>
      <Image
        src={imgUrl}
        width={16}
        height={16}
        alt={alt}
        className={`rounded-full object-contain ${imgStyles}`}
      />
      <p className={`${textStyles} flex items-center gap-1`}>
        {value}{" "}
        {title ? (
          <span className={cn(`small-regular line-clamp-1`, titleStyles)}>
            {title}
          </span>
        ) : null}
      </p>
    </>
  );
  return href ? (
    <Link className="flex-center gap-1" href={href}>
      {metricContent}
    </Link>
  ) : (
    <div className="flex-center gap-1">{metricContent}</div>
  );
};

export default Metric;
