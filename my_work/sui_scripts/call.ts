import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { keypair } from "./keypair";
import { Transaction } from "@mysten/sui/transactions";

const rpcUrl = getFullnodeUrl("devnet");

const client = new SuiClient({ url: rpcUrl });

(async () => {
  try {
    const txb = new Transaction();

    txb.moveCall({
      target: "package::module::function",
      arguments: [txb.object("object"), txb.pure.address("address_type")],
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
  } catch (e) {
    console.log("Something went wrong!");
    console.log(e);
  }
})();
