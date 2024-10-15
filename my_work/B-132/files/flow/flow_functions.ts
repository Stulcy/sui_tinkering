import { flowState } from "../../state/states";
import { BlubTx } from "../general/types";

export const initFlowTime = async () => {
  flowState.currUNIXHour = Math.floor(Date.now() / (1000 * 60 * 60));
};

export const updateFlowNumbers = async (tx: BlubTx) => {
  const nowHour = Math.floor(Date.now() / (1000 * 60 * 60));
  const currTxChange = tx.type === "buy" ? tx.suiAmount : -tx.suiAmount;

  if (nowHour === flowState.currUNIXHour) {
    // Same hour
    let currHourFlow = flowState.flowPerHour.get(0)!;
    flowState.flowPerHour.set(0, (currHourFlow += currTxChange));
  } else {
    // Hour changed
    for (let i = 0; i < 23; i++) {
      let prevHourlyFlow = flowState.flowPerHour.get(i)!;
      flowState.flowPerHour.set(i + 1, prevHourlyFlow);
    }

    flowState.flowPerHour.set(0, currTxChange);
  }
};
