import { sui_client } from "../sui_client";
import { BLUB_TYPE } from "../constants";
import { db_close, db_init } from "../database/init";
import { Wallet } from "../database/models/Wallet";

await db_init();

let index = 0;

for await (const wallet of Wallet.find()) {
  let blubAmount = 0;
  let suins: string | undefined;
  let getOut = false;

  // BLUB balance fetch
  await sui_client
    .getAllBalances({
      owner: wallet.address,
    })
    .then((res) => {
      blubAmount =
        Number(
          res.filter((coin) => coin.coinType === BLUB_TYPE)[0].totalBalance
        ) /
        10 ** 2;
      if (blubAmount === 0) {
        getOut = true;
      }
    })
    .catch((error) => {
      console.error("Error fetching balance:", error);
      return;
    });

  // Wallet has an empty BLUB object
  if (getOut) {
    await Wallet.deleteOne({ address: wallet.address });
    console.log(wallet.address, "was deleted");
    continue;
  }

  // SuiNS fetch
  await sui_client
    .resolveNameServiceNames({ address: wallet.address })
    .then((res) => {
      if (res.data && res.data.length > 0) {
        suins = res.data[0];
      }
    })
    .catch((_) => {});

  wallet.blub_amount = blubAmount;

  // SuiNS parsing
  if (suins) {
    suins = suins.slice(0, -4);
    if (suins.includes(".")) {
      suins = suins.replace(".", "@");
    } else {
      suins = `@${suins}`;
    }
    wallet.suins = suins;
  }

  await wallet.save();

  console.log(
    index,
    "Address:",
    wallet.address,
    ", Balance:",
    blubAmount,
    `${suins === undefined ? "" : `, Suins: ${suins}`}`
  );

  index += 1;
}

await db_close();
