import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { keypair } from "./keypair";

const rpcUrl = getFullnodeUrl("devnet");

const client = new SuiClient({ url: rpcUrl });

(async () => {
  try {
    const txb = new TransactionBlock();

    const timestamp = txb.moveCall({
      target: "0x2::clock::timestamp_ms",
      arguments: [txb.object("0x6")],
    });

    txb.setGasBudget(50000000);

    const result = await client.signAndExecuteTransactionBlock({
      signer: keypair,
      transactionBlock: txb,
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
