import { Client, Events, GatewayIntentBits } from "discord.js";
import { getBlubPrice } from "./files/blub_price";
import { getBlubAmount } from "./files/blub_amount";

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
  } catch (e) {
    console.error("Login failed", e);
    process.exit(1);
  }

  client.on(Events.MessageCreate, async (message) => {
    if (message.author.bot) return;

    if (message.content === "price") {
      await message.channel.sendTyping();
      const blubPrice = await getBlubPrice();
      await message.channel.send(`$${blubPrice}`);
    } else if (message.content === "portfolio") {
      await message.channel.sendTyping();
      const blubPrice = await getBlubPrice();
      const blubAmount = await getBlubAmount();
      const formattedAmount = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(blubPrice * blubAmount);
      await message.channel.send(formattedAmount);
    }
  });
};

initialize();
