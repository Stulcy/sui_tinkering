import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { BlubTx } from "../general/types";
import {
  TURBOS_BLUB_SUI_POOL,
  TURBOS_SWAP_EVENT_TYPE,
} from "../general/constants";

const rpcUrl = getFullnodeUrl("mainnet");

const client = new SuiClient({ url: rpcUrl });

const history: string[] = [];

export const getTurbosTxs = async () => {
  let blubTxs: BlubTx[] = [];

  await client
    .queryEvents({
      query: {
        MoveEventType: TURBOS_SWAP_EVENT_TYPE,
      },
    })
    .then((response) => {
      response.data
        .filter(
          (event) => (event.parsedJson as any).pool === TURBOS_BLUB_SUI_POOL
        )
        .map((event) => {
          const json = event.parsedJson as any;

          if (!history.includes(event.id.txDigest)) {
            if (history.length > 100) {
              history.shift();
            }
            history.push(event.id.txDigest);

            blubTxs.push({
              dex: "Turbos",
              address: event.sender,
              type: json.a_to_b ? "sell" : "buy",
              suiAmount: json.amount_b / 10 ** 9,
              blubAmount: json.amount_a / 10 ** 2,
              timestampMs: event.timestampMs ? +event.timestampMs : Date.now(),
              digest: event.id.txDigest,
            });
          }
        });
    })
    .catch((_) => {});

  return blubTxs.toReversed();
};
