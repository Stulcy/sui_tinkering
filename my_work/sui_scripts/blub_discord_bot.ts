import { Client, Events, GatewayIntentBits } from "discord.js";
import { getBlubPrice } from "./getting_blub_price";

export const client = new Client({
  intents: [
    GatewayIntentBits.Guilds, // servers
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

const initialize = async () => {
  const clientToken = process.env.DISCORD_CLIENT_TOKEN;

  try {
    await client.login(clientToken);
    console.log("[INFO] BLUB Bot Online");
  } catch (e) {
    console.error("[ERROR] Login failed", e);
    process.exit(1);
  }

  client
    .once("ready", async () => {})
    .on(Events.MessageCreate, async (message) => {
      if (message.author.bot) return;

      if (message.content === "gimme blub price") {
        await message.channel.sendTyping();
        const blubPrice = await getBlubPrice();
        await message.channel.send(`$${blubPrice}`);
      }

      // if (
      //   message.channelId === "1245075197573206026" &&
      //   message.toString() === "wen top"
      //   //   // message.author.id === "367667428072882186"
      //   //   // message.author.id === "207794615028285440"
      // ) {
      //   const info = await fetchCBBI();
      //   if (info) {
      //     message.channel.send(
      //       `⏳ ${info?.date.toLocaleString("en-US", {
      //         year: "numeric",
      //         month: "long",
      //         day: "numeric",
      //       })}\n🤰 $${new Intl.NumberFormat("en-US", {
      //         style: "decimal",
      //         maximumFractionDigits: 0,
      //         minimumFractionDigits: 0,
      //       }).format(info?.btc)}\n🤞🏼 ${(info?.cbbi * 100).toFixed(0)}%`
      //     );
      //     return;
      //   } else {
      //     message.channel.send("🤬 Faking nemorm dobit date brt.");
      //   }
      // }
    });
};

initialize();
