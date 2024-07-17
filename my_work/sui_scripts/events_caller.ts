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
        "0x08b5d6b7966ba5a88b0f6eb73142d28445ebe9b82602dfbfd4777471714fde82::event_emitter::emitAllClear",
      arguments: [],
    });

    txb.moveCall({
      target:
        "0x08b5d6b7966ba5a88b0f6eb73142d28445ebe9b82602dfbfd4777471714fde82::event_emitter::emitDanger",
      arguments: [],
    });

    txb.moveCall({
      target:
        "0x08b5d6b7966ba5a88b0f6eb73142d28445ebe9b82602dfbfd4777471714fde82::event_emitter::emitDefenseMode",
      arguments: [],
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
