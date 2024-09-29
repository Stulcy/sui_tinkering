import { decodeSuiPrivateKey } from "@mysten/sui/cryptography";
import { Ed25519Keypair } from "@mysten/sui/keypairs/ed25519";

let { secretKey } = decodeSuiPrivateKey(process.env.PRIVATE_KEY!);

export const keypair = Ed25519Keypair.fromSecretKey(secretKey);
