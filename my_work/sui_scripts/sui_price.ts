import axios from "axios";

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
