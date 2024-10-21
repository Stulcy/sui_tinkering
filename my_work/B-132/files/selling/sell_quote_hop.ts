import { HopApi, HopApiOptions } from "@hop.ag/sdk";
import { getFullnodeUrl } from "@mysten/sui/client";
import { BLUB_TOKEN, SUI_TOKEN } from "../general/constants";
import { getBlubPrice } from "../price_info/blub_price";
import { getBlubAmount } from "../price_info/blub_amount";
import { generalState } from "../../state/states";

const rpc_url = getFullnodeUrl("mainnet");
const hop_api_options: HopApiOptions = {
  api_key: process.env.HOP_API ?? "",
  fee_bps: 0,
  charge_fees_in_sui: true,
};

const sdk = new HopApi(rpc_url, hop_api_options);

export const getSellQuote = async () => {
  const blubAmount = await getBlubAmount();

  const quote = await sdk.fetchQuote({
    token_in: BLUB_TOKEN,
    token_out: SUI_TOKEN,
    amount_in: BigInt(Math.floor(blubAmount)),
  });

  return (Number(quote.amount_out_with_fee) / 10 ** 7) * generalState.suiPrice;
};
