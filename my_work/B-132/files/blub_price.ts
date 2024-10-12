import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { generalState } from "../state/general_state";
import { CETUS_BLUB_SUI_POOL } from "../constants";

const rpcUrl = getFullnodeUrl("mainnet");

const client = new SuiClient({ url: rpcUrl });

export const getBlubPrice = async () => {
  let pool = await client.getObject({
    id: CETUS_BLUB_SUI_POOL,
    options: { showContent: true },
  });

  const blubAmount = (pool.data?.content as any).fields.coin_a / 10 ** 2;
  const suiAmount = (pool.data?.content as any).fields.coin_b / 10 ** 9;

  return (suiAmount / blubAmount) * generalState.suiPrice;
};
