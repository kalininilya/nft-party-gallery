import React, { useState, useEffect } from "react";
import { Dispatch, SetStateAction } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { SigningStargateClient, StargateClient } from "@cosmjs/stargate";
import Warning from "./Warning";
import KeplrWallet from "./KeplrWallet";
import DisplaySettings from "./DisplaySettings";
import TransactionControls from "./TransactionControls";
import { STARGAZE_CHAIN_ID, STARGAZE_RPC_URL } from "@/constants";

interface BottomSheetProps {
  wallet: string;
  setWallet: (value: string) => void;
  nftCount: number;
  setNftCount: Dispatch<SetStateAction<number>>;
  bgImage: string;
  setBgImage: Dispatch<SetStateAction<string>>;
}

const BottomSheet = ({
  wallet,
  setWallet,
  nftCount,
  setNftCount,
  bgImage,
  setBgImage,
}: BottomSheetProps) => {
  const [keplrConnected, setKeplrConnected] = useState(false);
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [memo, setMemo] = useState("");
  const [txResult, setTxResult] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState<string | null>(null);
  const [savedLayouts, setSavedLayouts] = useState<any[]>([]);

  useEffect(() => {
    const storedLayouts = JSON.parse(localStorage.getItem("layouts") || "[]");
    setSavedLayouts(storedLayouts);
  }, []);

  const fetchBalance = async (address: string) => {
    try {
      const client = await StargateClient.connect(STARGAZE_RPC_URL);
      const allBalances = await client.getAllBalances(address);

      if (allBalances.length > 0) {
        const formattedBalance =
          (parseInt(allBalances[0].amount) / 1000000).toFixed(2) +
          " " +
          allBalances[0].denom;
        setBalance(formattedBalance);
      } else {
        setBalance("0 STARS");
      }
    } catch (error) {
      console.error("Failed to fetch balance:", error);
      setBalance("Error fetching balance");
    }
  };

  const sendTransaction = async () => {
    if (!wallet || !recipient || !amount) {
      alert("Please fill in all fields.");
      return;
    }

    setIsLoading(true);

    try {
      const offlineSigner = window.keplr.getOfflineSigner(STARGAZE_CHAIN_ID);
      const signingClient = await SigningStargateClient.connectWithSigner(
        STARGAZE_RPC_URL,
        offlineSigner
      );
      const amountFinal = { denom: "ustars", amount: amount };
      const fee = {
        amount: [{ denom: "ustars", amount: "5000" }],
        gas: "200000",
      };

      const result = await signingClient.sendTokens(
        wallet,
        recipient,
        [amountFinal],
        fee,
        memo
      );

      setTxResult(result.transactionHash);
      alert(`Transaction successful with hash: ${result.transactionHash}`);
    } catch (error) {
      alert("Failed to send transaction. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <div className="fixed bottom-0 left-0 w-full flex flex-col items-center z-50 mb-2">
          <Warning />
        </div>
      </SheetTrigger>
      <SheetContent side="bottom" className="w-full">
        <SheetHeader>
          <SheetTitle>Gallery Settings</SheetTitle>
        </SheetHeader>
        <div className="p-4 flex space-x-4 divide-x divide-gray-700">
          <div className="space-y-4 w-1/4 p-2">
            <Label htmlFor="wallet-address">Wallet Address</Label>
            <Input
              id="wallet-address"
              placeholder="Wallet Address"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              className="w-full"
              disabled={keplrConnected}
            />
          </div>
          <KeplrWallet
            balance={balance}
            setWallet={setWallet}
            keplrConnected={keplrConnected}
            setKeplrConnected={setKeplrConnected}
            fetchBalance={fetchBalance}
          />
          <TransactionControls
            wallet={wallet}
            recipient={recipient}
            setRecipient={setRecipient}
            amount={amount}
            setAmount={setAmount}
            memo={memo}
            setMemo={setMemo}
            sendTransaction={sendTransaction}
            keplrConnected={keplrConnected}
            isLoading={isLoading}
            txResult={txResult}
          />
          <DisplaySettings
            nftCount={nftCount}
            setNftCount={setNftCount}
            bgImage={bgImage}
            setBgImage={setBgImage}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default BottomSheet;
