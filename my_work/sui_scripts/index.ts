import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";

const rpcUrl = getFullnodeUrl("devnet");

const client = new SuiClient({ url: rpcUrl });

let coins = await client.getAllCoins({
  owner: "owner",
});

console.log(coins);

let coin = (
  await client.getAllCoins({
    owner: "owner",
  })
).data.filter((value) => (value.coinType = "type"));

console.log(coin);

let objects = await client.getOwnedObjects({
  owner: "owner",
});

console.log(objects);

let struct = await client.getNormalizedMoveStruct({
  package: "package",
  module: "module",
  struct: "struct",
});

console.log(struct);

let object_data = await client.getObject({
  id: "object_id",
  options: { showContent: true },
});

console.log((object_data.data?.content as any).fields);
