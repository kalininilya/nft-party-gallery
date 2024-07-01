import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { StargateClient } from "@cosmjs/stargate";
import { STARGAZE_CHAIN_ID, STARGAZE_RPC_URL } from "@/app/page";
import { Label } from "@/components/ui/label";

declare global {
  interface Window {
    keplr: any;
  }
}

const KeplrWallet = ({
  setWallet,
  keplrConnected,
  setKeplrConnected,
  fetchBalance,
  balance,
}: {
  setWallet: (wallet: string) => void;
  keplrConnected: boolean;
  setKeplrConnected: (connected: boolean) => void;
  fetchBalance: (address: string) => void;
  balance: string | null;
}) => {
  const connectKeplr = async () => {
    if (!window.keplr) {
      alert("Please install Keplr extension");
      return;
    }

    try {
      await window.keplr.enable(STARGAZE_CHAIN_ID);
      const offlineSigner = window.keplr.getOfflineSigner(STARGAZE_CHAIN_ID);
      const accounts = await offlineSigner.getAccounts();

      if (accounts.length > 0) {
        const address = accounts[0].address;

        setWallet(address);
        setKeplrConnected(true);
        fetchBalance(address);
      }
    } catch (error) {
      console.error("Failed to connect to Keplr:", error);
      alert("Failed to connect to Keplr. Please try again.");
    }
  };

  const disconnectKeplr = () => {
    setWallet("");
    setKeplrConnected(false);
  };

  return (
    <div className="space-y-4 w-1/4 p-2">
      <Label htmlFor="memo">Keplr Wallet</Label>
      {!keplrConnected ? (
        <Button onClick={connectKeplr} className="w-full">
          Connect wallet
        </Button>
      ) : (
        <>
          <p className="text-sm text-gray-500">Connected</p>
          {balance && (
            <p className="text-sm text-gray-700">Balance: {balance}</p>
          )}
          <Button onClick={disconnectKeplr} className="w-full">
            Disconnect Keplr
          </Button>
        </>
      )}
    </div>
  );
};

export default KeplrWallet;
