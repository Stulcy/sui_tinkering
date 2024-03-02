import { decodeSuiPrivateKey } from "@mysten/sui.js/cryptography";
import { Ed25519Keypair } from "@mysten/sui.js/keypairs/ed25519";
import dotenv from "dotenv";

dotenv.config();

let { secretKey } = decodeSuiPrivateKey(process.env.PRIVATE_KEY!);

export const keypair = Ed25519Keypair.fromSecretKey(secretKey);
