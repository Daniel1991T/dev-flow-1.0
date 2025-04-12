import React from "react";

import { RouteParams } from "@/types/global";

const TagPage = async ({ params }: RouteParams) => {
  const { id } = await params;
  return <div>{id}</div>;
};

export default TagPage;
