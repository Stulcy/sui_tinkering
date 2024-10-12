export interface BlubTx {
  address: string;
  type: "buy" | "sell";
  dex: string;
  suiAmount: number;
  blubAmount: number;
  date: string;
  digest: string;
}
