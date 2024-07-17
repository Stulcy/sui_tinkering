import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import { keypair } from "./keypair";
import { Transaction } from "@mysten/sui/transactions";

const rpcUrl = getFullnodeUrl("devnet");

const client = new SuiClient({ url: rpcUrl });

(async () => {
  try {
    const txb = new Transaction();

    txb.moveCall({
      target:
        "0x1caa00b44c2279aedc674bb82ea5c0e916c638e03c69d9ac9f7b91043fc086bd::duck::burn",
      arguments: [
        txb.object(
          "0x6ee2d90b882d7b5ab459a0a7f2bac73fab4d2ee8d9605d0d799fad2950a6ec23"
        ),
      ],
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
