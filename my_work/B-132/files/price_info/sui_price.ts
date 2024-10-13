import axios from "axios";
import { generalState } from "../../state/general_state";
import { FETCH_SUI_PRICE_DELAY_MS } from "../general/constants";

export const getSuiPriceCoingecko = async (): Promise<number> => {
  try {
    const response = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price",
      {
        params: {
          ids: "sui",
          vs_currencies: "usd",
        },
      }
    );

    return response.data.sui.usd;
  } catch (_) {
    return 0;
  }
};

export const getSuiPriceCMC = async (): Promise<number> => {
  try {
    const response = await axios.get(
      "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest",
      {
        headers: {
          "X-CMC_PRO_API_KEY": process.env.CMC_API_KEY,
        },
        params: {
          symbol: "SUI",
        },
      }
    );

    const suiPrice = response.data.data.SUI.quote.USD.price;
    return suiPrice;
  } catch (_) {
    return 0;
  }
};

export const trackSuiPrice = async () => {
  while (true) {
    const price = await getSuiPrice();
    generalState.suiPrice = price;
    await new Promise((f) => setTimeout(f, FETCH_SUI_PRICE_DELAY_MS));
  }
};

export const getSuiPrice = async () => {
  let price = await getSuiPriceCMC();
  if (price === 0) {
    price = await getSuiPriceCoingecko();
  }
  generalState.suiPrice = price;
  return price;
};
