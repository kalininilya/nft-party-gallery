"use client";
import React, { useState } from "react";
import { ApolloProvider } from "@apollo/client";
import { client } from "./graphql";
import BottomSheet from "../components/BottomSheet";
import Grid from "../components/Grid";

export const DEFAULT_WALLET = "badkids";
export const STARGAZE_CHAIN_ID = "stargaze-1";
export const STARGAZE_RPC_URL = "https://rpc.cosmos.directory/stargaze";

const App = () => {
  const [wallet, setWallet] = useState(DEFAULT_WALLET);
  const [bgImage, setBgImage] = useState("");
  const [nftCount, setNftCount] = useState(32);

  return (
    <ApolloProvider client={client}>
      <div className="flex h-screen flex-col">
        <BottomSheet
          wallet={wallet}
          setWallet={setWallet}
          nftCount={nftCount}
          setNftCount={setNftCount}
          bgImage={bgImage}
          setBgImage={setBgImage}
        />
        <Grid wallet={wallet} nftCount={nftCount} bgImage={bgImage} />
      </div>
    </ApolloProvider>
  );
};

export default App;
