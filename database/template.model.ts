import { model, models, Schema } from "mongoose";

export type TModel = {
  test: string;
};

const ModelSchema = new Schema<TModel>({}, { timestamps: true });
const Model = models?.model || model<TModel>("Account", ModelSchema);
export default Model;
