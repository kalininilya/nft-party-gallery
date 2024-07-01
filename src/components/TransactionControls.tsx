import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const TransactionControls = ({
  wallet,
  recipient,
  setRecipient,
  amount,
  setAmount,
  memo,
  setMemo,
  sendTransaction,
  keplrConnected,
  isLoading,
  txResult,
}: {
  wallet: any;
  recipient: any;
  setRecipient: any;
  amount: any;
  setAmount: any;
  memo: any;
  setMemo: any;
  sendTransaction: any;
  keplrConnected: any;
  isLoading: any;
  txResult: any;
}) => {
  return (
    <div className="space-y-4 w-1/4 p-2">
      <Label htmlFor="memo">Send transaction</Label>
      <Input
        id="recipient"
        placeholder="Recipient Address"
        value={recipient}
        onChange={(e) => setRecipient(e.target.value)}
        className="w-full"
      />
      <Input
        id="amount"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full"
      />

      <Input
        id="memo"
        placeholder="Memo"
        value={memo}
        onChange={(e) => setMemo(e.target.value)}
        className="w-full"
      />
      <Button
        onClick={sendTransaction}
        disabled={!keplrConnected || isLoading}
        className="w-full"
      >
        {isLoading ? "Sending..." : "Send Transaction"}
      </Button>
      {txResult && (
        <p className="text-sm font-bold">Transaction Hash: {txResult}</p>
      )}
    </div>
  );
};

export default TransactionControls;
