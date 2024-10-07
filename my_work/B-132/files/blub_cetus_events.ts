import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { User } from "discord.js";

const BLUB_SUI_CETUS_POOL =
  "0x40a372f9ee1989d76ceb8e50941b04468f8551d091fb8a5d7211522e42e60aaf";

const rpcUrl = getFullnodeUrl("mainnet");

const client = new SuiClient({ url: rpcUrl });

interface BlubTx {
  address: string;
  type: "buy" | "sell";
  suiAmount: number;
  blubAmount: number;
  date: string;
  digest: string;
}

const history: string[] = [];

export const getBlubCetusTxs = async () => {
  // const rn = new Date().getTime();

  let blubTxs: BlubTx[] = [];

  await client
    .queryEvents({
      query: {
        MoveEventType:
          "0x1eabed72c53feb3805120a081dc15963c204dc8d091542592abaf7a35689b2fb::pool::SwapEvent",
        // TimeRange: {
        //   startTime: (rn - 300000).toString(),
        //   endTime: rn.toString(),
        // },
      },
    })
    .then((response) => {
      response.data
        .filter(
          (event) => (event.parsedJson as any).pool === BLUB_SUI_CETUS_POOL
        )
        .map((event) => {
          const json = event.parsedJson as any;

          if (!history.includes(event.id.txDigest)) {
            if (history.length > 10) {
              history.shift();
            }
            history.push(event.id.txDigest);

            blubTxs.push({
              address: event.sender,
              type: json.atob ? "sell" : "buy",
              suiAmount:
                ((json.atob ? json.amount_out : json.amount_in) as number) /
                10 ** 9,
              blubAmount:
                ((json.atob ? json.amount_in : json.amount_out) as number) /
                10 ** 2,
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

export const trackCetusTxs = async (user: User) => {
  while (true) {
    const txs = await getBlubCetusTxs();
    if (txs.length > 0) {
      txs.forEach((tx) => {
        const txEmbed = {
          title: `${tx.type === "buy" ? "📈" : "📉"} ${tx.type.toUpperCase()}`,
          author: {
            name: tx.address,
            url: `https://suivision.xyz/account/${tx.address}`,
          },
          fields: [
            {
              name: `💧 SUI amount`,
              value: tx.suiAmount.toString(),
            },
            {
              name: "🔍 digest",
              value: tx.digest,
            },
          ],
          timestamp: new Date().toISOString(),
        };
        user.send({ embeds: [txEmbed] });
      });
    }

    await new Promise((f) => setTimeout(f, 3000));
  }
};
