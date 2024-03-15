import { getFullnodeUrl, SuiClient } from "@mysten/sui.js/client";
import { TransactionBlock } from "@mysten/sui.js/transactions";
import { keypair } from "./keypair";

const rpcUrl = getFullnodeUrl("devnet");

const client = new SuiClient({ url: rpcUrl });

const createKiosk = (txb: TransactionBlock) => {
  const [kiosk, kioskCap] = txb.moveCall({
    target: "0x2::kiosk::new",
  });
  return [kiosk, kioskCap];
};

const destroyAndWithdraw = (
  txb: TransactionBlock,
  kioskAddr: string,
  kioskCapAddr: string
) => {
  const [coin] = txb.moveCall({
    target: "0x2::kiosk::close_and_withdraw",
    arguments: [txb.object(kioskAddr), txb.object(kioskCapAddr)],
  });
  return coin;
};

const placeItem = (
  txb: TransactionBlock,
  kioskAddr: string,
  kioskCapAddr: string,
  itemAddr: string,
  itemType: string
) => {
  txb.moveCall({
    target: "0x2::kiosk::place",
    arguments: [
      txb.object(kioskAddr),
      txb.object(kioskCapAddr),
      txb.object(itemAddr),
    ],
    typeArguments: [itemType],
  });
};

const takeItem = (
  txb: TransactionBlock,
  kioskAddr: string,
  kioskCapAddr: string,
  itemAddr: string,
  itemType: string,
  receiver: string
) => {
  const [takenObject] = txb.moveCall({
    target: "0x2::kiosk::take",
    arguments: [
      txb.object(kioskAddr),
      txb.object(kioskCapAddr),
      txb.pure.id(itemAddr),
    ],
    typeArguments: [itemType],
  });

  txb.transferObjects([takenObject], receiver);
};

(async () => {
  try {
    const txb = new TransactionBlock();

    takeItem(
      txb,
      "0x5b8ce287bc712edf00ce2c70392086d418ff8137cdd1cc06d5106390dbceaf4a",
      "0xb23115010ff0aed165aa333cc5abcd859a7371ad2e6161b341c3b5ba2ee1947c",
      "0x3e4c211248c871dc3255922c7cd257223e957c4ce9d2e18a9b1c4e72d65ed395",
      "0x417a0a251775ed9c6cb091376f55618cab71cde1bba7d51caf325ff9fe846b5d::kramper::Reward",
      "0x350e3ab2fce5480592be8e5efffcf631c1cd0cb22dcf77ace1b97ca19f98b724"
    );

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
