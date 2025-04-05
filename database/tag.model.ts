import { model, models, Schema, Document } from "mongoose";

export type TTag = {
  name: string;
  questions: number;
};

export type TTagDoc = TTag & Document;

const TagSchema = new Schema<TTag>(
  {
    name: { type: String, required: true, unique: true },
    questions: { type: Number, default: 0 },
  },
  { timestamps: true },
);
const Tag = models?.Tag || model<TTag>("Tag", TagSchema);
export default Tag;
