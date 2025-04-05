import { model, models, Schema, Types } from "mongoose";

type TAccount = {
  userId: Types.ObjectId;
  name: string;
  image?: string;
  password?: string;
  provider: string;
  providerAccountId: string;
};

const AccountSchema = new Schema<TAccount>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    image: { type: String },
    password: { type: String },
    provider: { type: String, required: true },
    providerAccountId: { type: String, required: true },
  },
  { timestamps: true },
);
const Account = models?.account || model<TAccount>("Account", AccountSchema);
export default Account;
