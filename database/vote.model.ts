import { model, models, Schema, Types, Document } from "mongoose";

export type TVote = {
  author: Types.ObjectId;
  id: Types.ObjectId;
  type: "question" | "answer";
  voteType: "upvote" | "downvote";
};

export type TVoteDoc = TVote & Document;

const VoteSchema = new Schema<TVote>(
  {
    author: { type: Schema.Types.ObjectId, ref: "User", required: true },
    id: { type: Schema.Types.ObjectId, required: true },
    type: { type: String, enum: ["question", "answer"], required: true },
    voteType: { type: String, enum: ["upvote", "downvote"], required: true },
  },
  { timestamps: true },
);
const Vote = models?.Vote || model<TVote>("Vote", VoteSchema);
export default Vote;
