import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { getSuiPriceCMC } from "./sui_price";

const BLUB_SUI_CETUS_POOL =
  "0x40a372f9ee1989d76ceb8e50941b04468f8551d091fb8a5d7211522e42e60aaf";

const rpcUrl = getFullnodeUrl("mainnet");

const client = new SuiClient({ url: rpcUrl });

let pool = await client.getObject({
  id: BLUB_SUI_CETUS_POOL,
  options: { showContent: true },
});

const blubAmount = (pool.data?.content as any).fields.coin_a / 10 ** 2;
const suiAmount = (pool.data?.content as any).fields.coin_b / 10 ** 9;

const suiPrice = await getSuiPriceCMC();

console.log((suiAmount / blubAmount) * suiPrice);
