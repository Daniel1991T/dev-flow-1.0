import { model, models, Schema } from "mongoose";

type TModel = {};

const ModelSchema = new Schema<TModel>({}, { timestamps: true });
const Model = models?.model || model<TModel>("Account", ModelSchema);
export default Model;
