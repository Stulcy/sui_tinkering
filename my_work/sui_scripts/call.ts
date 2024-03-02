import { TransactionBlock } from "@mysten/sui.js/transactions";
import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { keypair } from "./keypair";

const rpcUrl = getFullnodeUrl("devnet");

const client = new SuiClient({ url: rpcUrl });

(async () => {
  try {
    const txb = new TransactionBlock();

    txb.moveCall({
      target: "package::module::function",
      arguments: [txb.object("object"), txb.pure.address("address_type")],
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
  } catch (e) {
    console.log("Something went wrong!");
    console.log(e);
  }
})();
