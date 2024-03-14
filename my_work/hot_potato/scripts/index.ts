import { SuiClient, getFullnodeUrl } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { keypair } from "./keypair";

const rpcUrl = getFullnodeUrl("devnet");

const client = new SuiClient({ url: rpcUrl });

const PACKAGE_ADDR =
  "0x417a0a251775ed9c6cb091376f55618cab71cde1bba7d51caf325ff9fe846b5d";

(async () => {
  try {
    const txb = new TransactionBlock();

    const [kramper] = txb.moveCall({
      target: `${PACKAGE_ADDR}::kramper::get_kramper`,
    });

    const [reward] = txb.moveCall({
      target: `${PACKAGE_ADDR}::kramper::return_kramper`,
      arguments: [kramper],
    });

    txb.transferObjects(
      [reward],
      "0x350e3ab2fce5480592be8e5efffcf631c1cd0cb22dcf77ace1b97ca19f98b724"
    );

    txb.setGasBudget(50000000);

    await client.signAndExecuteTransactionBlock({
      signer: keypair,
      transactionBlock: txb,
      options: {
        showObjectChanges: true,
      },
    });
  } catch (e) {
    console.log("Something went wrong!");
    console.log(e);
  }
})();
