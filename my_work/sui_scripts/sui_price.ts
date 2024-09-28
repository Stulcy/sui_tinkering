import axios from "axios";

export const getSuiPrice = async (): Promise<number> => {
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
  } catch (e) {
    return 0;
  }
};
