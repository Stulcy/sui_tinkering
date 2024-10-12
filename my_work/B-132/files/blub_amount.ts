import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { BLUB_COIN_TYPE } from "../constants";

const rpcUrl = getFullnodeUrl("mainnet");

const client = new SuiClient({ url: rpcUrl });

export const getBlubAmount = async () => {
  const blubCoins = await client.getCoins({
    owner: process.env.WALLET_ADDRESS ?? "",
    coinType: BLUB_COIN_TYPE,
  });

  const blubAmount =
    blubCoins.data.reduce((prev, curr) => prev + +curr.balance, 0) / 10 ** 2;

  return blubAmount;
};
