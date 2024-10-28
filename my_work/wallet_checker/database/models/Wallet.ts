import mongoose from "mongoose";

const schemaOptions = {
  versionKey: false,
  timestamps: { createdAt: "createdAt", updatedAt: "updatedAt" },
};

const walletSchema = new mongoose.Schema(
  {
    address: {
      type: String,
      required: true,
      immutable: true,
      unique: true,
    },
    suins: {
      type: String,
    },
    blub_amount: {
      type: Number,
      default: 0,
    },
  },
  schemaOptions
);

export const Wallet = mongoose.model("Wallet", walletSchema);
