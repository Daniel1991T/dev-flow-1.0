import { model, models, Schema } from "mongoose";

export type TModel = {
  test: string;
};

const ModelSchema = new Schema<TModel>({}, { timestamps: true });
const Model = models?.Model || model<TModel>("Model", ModelSchema);
export default Model;
