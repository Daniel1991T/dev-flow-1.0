import { model, models, Schema, Types, Document } from "mongoose";

export type TTagQuestion = {
  question: Types.ObjectId;
  tag: Types.ObjectId;
};

export type TTagQuestionDoc = TTagQuestion & Document;

const TagQuestionSchema = new Schema<TTagQuestion>(
  {
    question: { type: Schema.Types.ObjectId, ref: "Question", required: true },
    tag: { type: Schema.Types.ObjectId, ref: "Tag", required: true },
  },
  { timestamps: true },
);
const TagQuestion =
  models?.TagQuestion || model<TTagQuestion>("TagQuestion", TagQuestionSchema);
export default TagQuestion;
