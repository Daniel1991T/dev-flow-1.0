import { model, models, Schema } from "mongoose";

export type TUser = {
  name: string;
  email: string;
  username: string;
  bio?: string;
  image: string;
  location?: string;
  portfolio?: string;
  reputation?: number;
};

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true },
    bio: { type: String },
    image: { type: String, required: true },
    location: { type: String },
    portfolio: { type: String },
    reputation: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const User = models?.user || model<TUser>("User", UserSchema);

export default User;
