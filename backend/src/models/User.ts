import mongoose, { Document, Schema } from "mongoose";

export interface IUser extends Document {
  walletAddress: string;
  role: "patient" | "researcher";
  createdAt: Date;
}

const UserSchema: Schema = new Schema({
  walletAddress: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    enum: ["patient", "researcher"],
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model<IUser>("User", UserSchema);
export default User;
