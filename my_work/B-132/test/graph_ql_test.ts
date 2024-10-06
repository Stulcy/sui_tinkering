import { SuiGraphQLClient } from "@mysten/sui/graphql";
import { graphql } from "@mysten/sui/graphql/schemas/2024.4";

const client = new SuiGraphQLClient({
  url: "https://sui-mainnet.mystenlabs.com/graphql", // or the testnet endpoint
});

const gqlQuery = graphql(`
  query ($objectID: SuiAddress!) {
    object(address: $objectID) {
      address
    }
  }
`);

const fetchGraphQl = async () => {
  await client
    .query({
      query: gqlQuery,
      variables: {
        objectID:
          "0x40a372f9ee1989d76ceb8e50941b04468f8551d091fb8a5d7211522e42e60aaf",
      },
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
};

fetchGraphQl();
