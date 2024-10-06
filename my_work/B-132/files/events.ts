import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";

const BLUB_SUI_CETUS_POOL =
  "0x40a372f9ee1989d76ceb8e50941b04468f8551d091fb8a5d7211522e42e60aaf";

const rpcUrl = getFullnodeUrl("mainnet");

const client = new SuiClient({ url: rpcUrl });

interface BlubTx {
  type: "buy" | "sell";
  suiAmount: number;
  blubAmount: number;
}

export const getBlubEvents = async () => {
  await client
    .queryEvents({
      query: {
        MoveEventType:
          "0x1eabed72c53feb3805120a081dc15963c204dc8d091542592abaf7a35689b2fb::pool::SwapEvent",
      },
    })
    .then((response) => {
      const blubEvents: BlubTx[] = response.data
        .filter(
          (event) => (event.parsedJson as any).pool === BLUB_SUI_CETUS_POOL
        )
        .map((event) => {
          const json = event.parsedJson as any;
          return {
            type: json.atob ? "sell" : "buy",
            suiAmount:
              ((json.atob ? json.amount_out : json.amount_in) as number) /
              10 ** 9,
            blubAmount:
              ((json.atob ? json.amount_in : json.amount_out) as number) /
              10 ** 2,
          };
        });

      console.log(blubEvents);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
};

getBlubEvents();
