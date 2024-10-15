import { User } from "discord.js";
import {
  GREEN_COLOR,
  RED_COLOR,
  FETCH_EVENTS_DELAY_MS,
} from "../general/constants";
import { generalState } from "../../state/states";
import { getCetusTxs } from "./cetus_txs";
import { getTurbosTxs } from "./turbos_txs";
import { getBlubPrice } from "../price_info/blub_price";
import { updateFlowNumbers } from "../flow/flow_functions";

export const trackTxs = async () => {
  while (true) {
    if (generalState.txTrackingRunning) {
      const cetusTxs = await getCetusTxs();
      const turbosTxs = await getTurbosTxs();
      const txs = [...cetusTxs, ...turbosTxs];

      if (txs.length > 0) {
        txs.forEach(async (tx) => {
          await updateFlowNumbers(tx);

          if (tx.suiAmount * generalState.suiPrice > 10000) {
            const blubPrice = await getBlubPrice();
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
                  name: `💰 $${(tx.suiAmount * generalState.suiPrice).toFixed(
                    2
                  )} (${tx.suiAmount.toFixed(2)} SUI)`,
                  value: "",
                },
                {
                  name: `$BLUB price`,
                  value: `$${blubPrice.toFixed(10)}`,
                },
                {
                  name: "Wallet",
                  value: tx.address,
                },
              ],
              timestamp: new Date().toISOString(),
            };
            generalState.user!.send({ embeds: [txEmbed] });
          }
        });
      }
    }

    await new Promise((f) => setTimeout(f, FETCH_EVENTS_DELAY_MS));
  }
};
