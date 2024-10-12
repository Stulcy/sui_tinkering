import { Client, Events, GatewayIntentBits } from "discord.js";
import { getBlubPrice } from "./files/blub_price";
import { getBlubAmount } from "./files/blub_amount";
import { trackTxs } from "./files/track_txs";
import { generalState } from "./state/general_state";
import { fetchSuiPrice, getSuiPrice } from "./files/sui_price";

export const client = new Client({
  intents: [GatewayIntentBits.MessageContent, GatewayIntentBits.DirectMessages],
});

const initialize = async () => {
  const clientToken = process.env.DISCORD_CLIENT_TOKEN;

  try {
    await client.login(clientToken);
    console.log("Bot Online");

    // Initial contact
    const user = await client.users.fetch(process.env.DISCORD_USER_ID ?? "");
    await user.send("gm");

    // Start fetching SUI price
    fetchSuiPrice();

    // Start listening for TXs
    trackTxs(user);
  } catch (e) {
    console.error("Login failed", e);
    process.exit(1);
  }

  client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;

    await message.channel.sendTyping();

    switch (message.content) {
      case "price": {
        const blubPrice = await getBlubPrice();
        await message.channel.send(`$${blubPrice}`);
        break;
      }
      case "portfolio": {
        let blubPrice = await getBlubPrice();
        const blubAmount = await getBlubAmount();
        const formattedAmount = new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
        }).format(blubPrice * blubAmount);
        await message.channel.send(formattedAmount);
        break;
      }
      case "start":
        if (generalState.txTrackingRunning) {
          await message.channel.send("Already running chief.");
        } else {
          generalState.txTrackingRunning = true;
          await message.channel.send("Tx tracking started.");
        }
        break;
      case "stop":
        if (!generalState.txTrackingRunning) {
          await message.channel.send("Can't turn it off twice man.");
        } else {
          generalState.txTrackingRunning = false;
          await message.channel.send("Tx tracking stopped.");
        }
        break;
      case "update price":
        const price = await getSuiPrice();
        await message.channel.send(`SUI price updated to $${price}`);
        break;
      default:
        await message.channel.send("Unknown command bro.");
        break;
    }
  });
};

initialize();
