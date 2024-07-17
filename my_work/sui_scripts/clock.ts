import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { keypair } from "./keypair";
import { Transaction } from "@mysten/sui/transactions";

const rpcUrl = getFullnodeUrl("devnet");

const client = new SuiClient({ url: rpcUrl });

(async () => {
  try {
    const txb = new Transaction();

    const timestamp = txb.moveCall({
      target: "0x2::clock::timestamp_ms",
      arguments: [txb.object("0x6")],
    });

    txb.setGasBudget(50000000);

    const result = await client.signAndExecuteTransaction({
      signer: keypair,
      transaction: txb,
      options: {
        showObjectChanges: true,
      },
    });

    console.log(result);
    console.log(timestamp);
  } catch (e) {
    console.log("Something went wrong!");
    console.log(e);
  }
})();
