import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const DisplaySettings = ({
  nftCount,
  setNftCount,
  bgImage,
  setBgImage,
}: {
  nftCount: number;
  setNftCount: React.Dispatch<React.SetStateAction<number>>;
  bgImage: string;
  setBgImage: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <div className="space-y-4 w-1/4 p-2">
      <Label className="mb-2 block">Number of NFTs</Label>
      <div className="flex space-x-2">
        <Button
          onClick={() => setNftCount((prev: number) => Math.max(prev - 10, 1))}
          className="px-4"
        >
          -
        </Button>
        <Input
          type="number"
          value={nftCount}
          onChange={(e) => setNftCount(Number(e.target.value))}
          className="w-16 text-center no-arrows"
        />
        <Button
          onClick={() => setNftCount((prev: number) => prev + 10)}
          className="px-4"
        >
          +
        </Button>
      </div>
      <Input
        id="bg-image"
        placeholder="Background URL"
        value={bgImage}
        onChange={(e) => setBgImage(e.target.value)}
        className="w-full"
      />
    </div>
  );
};

export default DisplaySettings;
