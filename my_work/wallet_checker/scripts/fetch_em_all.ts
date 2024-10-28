import { SuiGraphQLClient } from "@mysten/sui/graphql";
import { graphql } from "@mysten/sui/graphql/schemas/2024.4";
import { db_close, db_init } from "../database/init";
import { Wallet } from "../database/models/Wallet";

const client = new SuiGraphQLClient({
  url: "https://sui-mainnet.mystenlabs.com/graphql",
});

const queryInit = graphql(`
  query {
    objects(
      first: 50
      filter: {
        type: "0x2::coin::Coin<0xfa7ac3951fdca92c5200d468d31a365eb03b2be9936fde615e69f0c1274ad3a0::BLUB::BLUB>"
      }
    ) {
      nodes {
        address
        owner {
          ...theAddressOwner
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }

  fragment theAddressOwner on AddressOwner {
    owner {
      address
    }
  }
`);

const queryWithCursor = graphql(`
  query ($cursor: String) {
    objects(
      after: $cursor
      first: 50
      filter: {
        type: "0x2::coin::Coin<0xfa7ac3951fdca92c5200d468d31a365eb03b2be9936fde615e69f0c1274ad3a0::BLUB::BLUB>"
      }
    ) {
      nodes {
        address
        owner {
          ...theAddressOwner
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }

  fragment theAddressOwner on AddressOwner {
    owner {
      address
    }
  }
`);

let cursor: string = "";
let hasNextPage = true;
let objectsChecked = 0;
let newWalletsAdded = 0;

await db_init();

while (hasNextPage) {
  await client
    .query({
      query: cursor !== "" ? queryWithCursor : queryInit,
      variables: {
        cursor: cursor,
      },
    })
    .then(async (response) => {
      for (const blubObject of response.data?.objects.nodes!) {
        const wallet = (blubObject.owner as any).owner.address;

        await Wallet.create({
          address: wallet,
        })
          .then(() => {
            newWalletsAdded += 1;
          })
          .catch((e) => {
            if (e.code !== 11000) {
              throw Error("Could not add wallet -", wallet);
            }
          });
      }

      if (response.data?.objects.pageInfo.hasNextPage) {
        cursor = response.data?.objects.pageInfo.endCursor!;
      } else {
        hasNextPage = false;
      }

      objectsChecked += response.data?.objects.nodes
        ? response.data?.objects.nodes.length
        : 0;

      console.log(
        "Objects checked:",
        objectsChecked,
        ",Wallets added:",
        newWalletsAdded
      );
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      hasNextPage = false;
    });
}

await db_close();
