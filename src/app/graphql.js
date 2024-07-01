import { ApolloClient, InMemoryCache, gql } from "@apollo/client";

// Create Apollo Client instance
export const client = new ApolloClient({
  uri: "https://graphql.mainnet.stargaze-apis.com/graphql",
  cache: new InMemoryCache(),
});

// Query for fetching NFTs
export const GET_NFTS = gql`
  query GetNFTs($owner: String!, $limit: Int!) {
    tokens(ownerAddrOrName: $owner, limit: $limit) {
      tokens {
        id
        name
        media {
          url
          type
        }
        collection {
          name
        }
      }
      pageInfo {
        total
        offset
        limit
      }
    }
  }
`;
