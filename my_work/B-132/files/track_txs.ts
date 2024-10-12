import { User } from "discord.js";
import { getCetusTxs } from "./cetus_txs";
import { getTurbosTxs } from "./turbos_txs";
import { FETCH_EVENTS_DELAY_MS, GREEN_COLOR, RED_COLOR } from "../constants";

export const trackTxs = async (user: User) => {
  while (true) {
    const cetusTxs = await getCetusTxs();
    const turbosTxs = await getTurbosTxs();
    const txs = [...cetusTxs, ...turbosTxs];

    if (txs.length > 0) {
      txs.forEach((tx) => {
        const txEmbed = {
          color: tx.type === "buy" ? GREEN_COLOR : RED_COLOR,
          title: `${
            tx.type === "buy" ? "🌱" : "🚨"
          } ${tx.type.toUpperCase()} on ${tx.dex}`,
          author: {
            name: tx.digest,
            url: `https://suivision.xyz/txblock/${tx.digest}`,
          },
          fields: [
            {
              name: `💧 ${tx.suiAmount.toFixed(2)} SUI`,
              value: "",
            },
            {
              name: "Wallet",
              value: tx.address,
            },
          ],
          timestamp: new Date().toISOString(),
        };
        user.send({ embeds: [txEmbed] });
      });
    }

    await new Promise((f) => setTimeout(f, FETCH_EVENTS_DELAY_MS));
  }
};
