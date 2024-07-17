import { keypair } from "./keypair";

export const getSuiAddressFromPrivate = () => {
  return keypair.getPublicKey().toSuiAddress();
};
