import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";

const rpcUrl = getFullnodeUrl("mainnet");

const client = new SuiClient({ url: rpcUrl });

export const getBlubAmount = async () => {
  const blubCoins = await client.getCoins({
    owner: process.env.WALLET_ADDRESS ?? "",
    coinType:
      "0xfa7ac3951fdca92c5200d468d31a365eb03b2be9936fde615e69f0c1274ad3a0::BLUB::BLUB",
  });

  const blubAmount =
    blubCoins.data.reduce((prev, curr) => prev + +curr.balance, 0) / 10 ** 2;

  return blubAmount;
};
