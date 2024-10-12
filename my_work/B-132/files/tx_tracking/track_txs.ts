import { User } from "discord.js";
import {
  GREEN_COLOR,
  RED_COLOR,
  FETCH_EVENTS_DELAY_MS,
} from "../general/constants";
import { generalState } from "../../state/general_state";
import { getCetusTxs } from "./cetus_txs";
import { getTurbosTxs } from "./turbos_txs";

export const trackTxs = async (user: User) => {
  while (true) {
    if (generalState.txTrackingRunning) {
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
    }

    await new Promise((f) => setTimeout(f, FETCH_EVENTS_DELAY_MS));
  }
};
