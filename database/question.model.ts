import { model, models, Schema, Types } from "mongoose";

type TQuestion = {
  title: string;
  content: string;
  tags: Types.ObjectId[];
  views: number;
  upvotes: number;
  downvotes: number;
  answers: number;
  author: Types.ObjectId;
};

const ModelSchema = new Schema<TQuestion>(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: Schema.Types.ObjectId, ref: "Tag" }],
    views: { type: Number, default: 0 },
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 },
    answers: { type: Number, default: 0 },
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true },
);
const Question = models?.question || model<TQuestion>("Question", ModelSchema);
export default Question;
