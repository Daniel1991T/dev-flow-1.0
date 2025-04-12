import React from "react";

import { getTags } from "@/lib/actions/tag.actions";

const Tags = async () => {
  const { data } = await getTags({
    page: 1,
    pageSize: 10,
    query: "",
    filter: "",
  });

  const { tags } = data || {};
  console.log("tags", JSON.stringify(tags, null, 2));

  return <div>{data?.tags.toString()}</div>;
};

export default Tags;
