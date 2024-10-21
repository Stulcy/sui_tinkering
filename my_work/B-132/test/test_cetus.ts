import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";
import {
  CETUS_BLUB_SUI_POOL,
  CETUS_SWAP_EVENT_TYPE,
  TURBOS_BLUB_SUI_POOL,
  TURBOS_SWAP_EVENT_TYPE,
} from "../files/general/constants";

const rpcUrl = getFullnodeUrl("mainnet");

const client = new SuiClient({ url: rpcUrl });

let nextCursor = null;

let inOutSui = 0;

const history: string[] = [];

const trackingStartDate = Date.now();

const hourInMs = 1000 * 60 * 60;

//                  1, 2, 4,12,24
const suiChanges = [0, 0, 0, 0, 0];

while (suiChanges[4] === 0) {
  await client
    .queryEvents({
      query: {
        MoveEventType: CETUS_SWAP_EVENT_TYPE,
      },
      cursor: nextCursor,
    })
    .then((response) => {
      const eventsDateUNIXms =
        +response.data[response.data.length - 1].timestampMs!;
      response.data
        .filter(
          (event) => (event.parsedJson as any).pool === CETUS_BLUB_SUI_POOL
        )
        .map((event) => {
          const json = event.parsedJson as any;
          if (!history.includes(event.id.txDigest)) {
            if (history.length > 100) {
              history.shift();
            }
            history.push(event.id.txDigest);
            inOutSui += json.atob
              ? -(json.atob ? json.amount_out : json.amount_in) / 10 ** 9
              : (json.atob ? json.amount_out : json.amount_in) / 10 ** 9;
          }
        });
      // Add to last X hours data
      if (suiChanges[0] === 0) {
        // 1h
        if (trackingStartDate - eventsDateUNIXms > hourInMs) {
          suiChanges[0] = inOutSui;
          console.log("Last hour:", inOutSui);
        }
      } else if (suiChanges[1] === 0) {
        // 2h
        if (trackingStartDate - eventsDateUNIXms > hourInMs * 2) {
          suiChanges[1] = inOutSui;
          console.log("Last 2 hours:", inOutSui);
        }
      } else if (suiChanges[2] === 0) {
        // 4h
        if (trackingStartDate - eventsDateUNIXms > hourInMs * 4) {
          suiChanges[2] = inOutSui;
          console.log("Last 4 hours:", inOutSui);
        }
      } else if (suiChanges[3] === 0) {
        // 12h
        if (trackingStartDate - eventsDateUNIXms > hourInMs * 12) {
          suiChanges[3] = inOutSui;
          console.log("Last 12 hours:", inOutSui);
        }
      } else if (suiChanges[4] === 0) {
        // 24h
        if (trackingStartDate - eventsDateUNIXms > hourInMs * 24) {
          suiChanges[4] = inOutSui;
          console.log("Last 24 hours:", inOutSui);
        }
      }
      nextCursor = response.nextCursor;
    })
    .catch((_) => {});
}
