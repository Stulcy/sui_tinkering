import { Client, Events, GatewayIntentBits } from "discord.js";
import { getBlubAmount } from "./files/price_info/blub_amount";
import { getBlubPrice } from "./files/price_info/blub_price";
import { trackSuiPrice, getSuiPrice } from "./files/price_info/sui_price";
import { trackTxs } from "./files/tx_tracking/track_txs";
import { flowState, generalState } from "./state/states";
import { initFlowTime } from "./files/flow/flow_functions";
import { getSellQuote } from "./files/selling/sell_quote_hop";

export const client = new Client({
  intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages],
});

const initialize = async () => {
  const clientToken = process.env.DISCORD_CLIENT_TOKEN;

  try {
    await client.login(clientToken);

    // Initial contact
    const user = await client.users.fetch(process.env.DISCORD_USER_ID ?? "");
    generalState.user = user;

    await user.send("gm");
    console.log("Bot Online");

    initFlowTime();

    // Start fetching SUI price
    trackSuiPrice();

    // Start listening for TXs
    trackTxs();
  } catch (e) {
    console.error("Login failed", e);
    process.exit(1);
  }

  client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;

    await message.channel.sendTyping();

    switch (message.content) {
      case "commands": {
        await message.channel.send(
          `- **price** ($BLUB price)\n- **portfolio** ($ value of $BLUB)\n - **start** (start tracking TXs)\n - **stop** (stop tracking TXs)\n - **update price** (manually fetch $SUI price)\n - **flow** (inflow/outflow stats)\n - **sell** (if u Dolfe the chart)`
        );
        break;
      }
      case "price": {
        const blubPrice = await getBlubPrice();
        await message.channel.send(`$${blubPrice.toFixed(10)}`);
        break;
      }
      case "portfolio": {
        const blubPrice = await getBlubPrice();
        const blubAmount = await getBlubAmount();
        const formattedAmount = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(blubPrice * blubAmount);
        await message.channel.send(formattedAmount);
        break;
      }
      case "start": {
        if (generalState.txTrackingRunning) {
          await message.channel.send("Already running chief.");
        } else {
          generalState.txTrackingRunning = true;
          await message.channel.send("Tx tracking started.");
        }
        break;
      }
      case "stop": {
        if (!generalState.txTrackingRunning) {
          await message.channel.send("Can't turn it off twice man.");
        } else {
          generalState.txTrackingRunning = false;
          await message.channel.send("Tx tracking stopped.");
        }
        break;
      }
      case "update price": {
        const price = await getSuiPrice();
        await message.channel.send(`SUI price updated to $${price}`);
        break;
      }
      case "flow": {
        const hourlyFlows = Array.from(flowState.flowPerHour.entries());
        const last4Hours = hourlyFlows
          .filter((item) => item[0] < 4)
          .reduce((prev, curr) => (prev += curr[1]), 0);
        const last12Hours = hourlyFlows
          .filter((item) => item[0] < 12)
          .reduce((prev, curr) => (prev += curr[1]), 0);
        const last24Hours = hourlyFlows.reduce(
          (prev, curr) => (prev += curr[1]),
          0
        );
        await message.channel.send(
          `Last hour: **${flowState.flowPerHour
            .get(0)
            ?.toFixed(2)} SUI**\nLast 4 hours: **${last4Hours.toFixed(
            2
          )} SUI**\nLast 12 hours: **${last12Hours.toFixed(
            2
          )} SUI**\nLast 24 hours: **${last24Hours.toFixed(2)} SUI**`
        );
        break;
      }
      case "sell": {
        const amountOut = await getSellQuote();
        const formattedAmount = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(amountOut);
        await message.channel.send(formattedAmount);
        break;
      }
      default: {
        await message.channel.send("Unknown command bro.");
        break;
      }
    }
  });
};

initialize();
