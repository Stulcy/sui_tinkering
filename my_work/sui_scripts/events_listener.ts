import { getFullnodeUrl, SuiClient, Unsubscribe } from "@mysten/sui.js/client";

const rpcUrl = getFullnodeUrl("devnet");

const client = new SuiClient({ url: rpcUrl });

const PACKAGE_ID =
  "0x08b5d6b7966ba5a88b0f6eb73142d28445ebe9b82602dfbfd4777471714fde82";

let unsubscribe: Unsubscribe | undefined = await client.subscribeEvent({
  filter: { Package: PACKAGE_ID },
  onMessage: (event) => console.log(event.type.split("::")[2].slice(1)),
});

process.on("SIGINT", async () => {
  console.log("\nTurning off..");

  if (unsubscribe) {
    await unsubscribe();
    unsubscribe = undefined;
  }

  process.exit();
});
