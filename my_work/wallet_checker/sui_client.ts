import { getFullnodeUrl, SuiClient } from "@mysten/sui/client";

const rpcUrl = getFullnodeUrl("mainnet");

export const sui_client = new SuiClient({ url: rpcUrl });
