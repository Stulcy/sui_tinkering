import { User } from "discord.js";

export interface BlubTx {
  address: string;
  type: "buy" | "sell";
  dex: string;
  suiAmount: number;
  blubAmount: number;
  timestampMs: number;
  digest: string;
}

export interface GeneralState {
  user: undefined | User;
  suiPrice: number;
  txTrackingRunning: boolean;
}

export interface FlowState {
  currUNIXHour: number;
  flowPerHour: Map<number, number>; // For the last 24 hours
}
