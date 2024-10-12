import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { BlubTx } from "../types";
import { CETUS_BLUB_SUI_POOL, CETUS_SWAP_EVENT_TYPE } from "../constants";

const rpcUrl = getFullnodeUrl("mainnet");

const client = new SuiClient({ url: rpcUrl });

const history: string[] = [];

export const getCetusTxs = async () => {
  let blubTxs: BlubTx[] = [];

  await client
    .queryEvents({
      query: {
        MoveEventType: CETUS_SWAP_EVENT_TYPE,
      },
    })
    .then((response) => {
      response.data
        .filter(
          (event) => (event.parsedJson as any).pool === CETUS_BLUB_SUI_POOL
        )
        .map((event) => {
          const json = event.parsedJson as any;

          if (!history.includes(event.id.txDigest)) {
            if (history.length > 100) {
              history.shift();
            }
            history.push(event.id.txDigest);

            blubTxs.push({
              dex: "Cetus",
              address: event.sender,
              type: json.atob ? "sell" : "buy",
              suiAmount:
                (json.atob ? json.amount_out : json.amount_in) / 10 ** 9,
              blubAmount:
                (json.atob ? json.amount_in : json.amount_out) / 10 ** 2,
              date: new Date(
                event.timestampMs ? +event.timestampMs : Date.now()
              ).toLocaleString(),
              digest: event.id.txDigest,
            });
          }
        });
    })
    .catch((_) => {});

  return blubTxs.toReversed();
};
