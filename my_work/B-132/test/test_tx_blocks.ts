import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";

const rpcUrl = getFullnodeUrl("mainnet");

const client = new SuiClient({ url: rpcUrl });

// while (true) {
await client
  .queryTransactionBlocks({
    filter: {
      MoveFunction: {
        function: "cetus_swap_a2b",
        module: "router",
        package:
          "0xa6e50ecf3b385144cd01de7924351ab55b70078606625914b04ea5c529293382",
      },
    },
  })
  .then((response) => {
    console.log(response);
  });
// }
