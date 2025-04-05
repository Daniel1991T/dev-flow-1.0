import { Document, model, models, Schema, Types } from "mongoose";

export type TInteraction = {
  user: Types.ObjectId;
  action: string;
  actionId: Types.ObjectId;
  actionType: "question" | "answer";
};

export type TInteractionDoc = TInteraction & Document;

const InteractionSchema = new Schema<TInteraction>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    action: { type: String, required: true },
    actionId: { type: Schema.Types.ObjectId, required: true },
    actionType: { type: String, enum: ["question", "answer"], required: true },
  },
  { timestamps: true },
);
const Interaction =
  models?.Interaction || model<TInteraction>("Interaction", InteractionSchema);
export default Interaction;
