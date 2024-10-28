import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import {
  CETUS_BLUB_SUI_POOL,
  CETUS_SWAP_EVENT_TYPE,
} from "../files/general/constants";
import { readFileSync, writeFileSync, appendFileSync } from "fs";
import { stringify } from "querystring";

const rpcUrl = getFullnodeUrl("mainnet");

const client = new SuiClient({ url: rpcUrl });

let nextCursor = null;

writeFileSync("tmp_other.txt", "");

while (true) {
  await client
    .queryEvents({
      query: {
        MoveEventType:
          "0xeffc8ae61f439bb34c9b905ff8f29ec56873dcedf81c7123ff2f1f67c45ec302::cetus::CetusSwapEvent",
      },
      cursor: nextCursor,
    })
    .then((response) => {
      response.data
        .filter(
          (event) =>
            (event.parsedJson as any).coin_a.name ===
            "fa7ac3951fdca92c5200d468d31a365eb03b2be9936fde615e69f0c1274ad3a0::BLUB::BLUB"
        )
        .map((event) => {
          appendFileSync(
            "tmp_other.txt",
            `\n${event.id.txDigest} ${(event.parsedJson as any).amount_in} ${
              (event.parsedJson as any).amount_out
            }`
          );
        });

      nextCursor = response.nextCursor;
    })
    .catch((_) => {});
}
