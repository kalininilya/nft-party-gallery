import React, { useState, useEffect, useRef, useCallback } from "react";
import { useQuery } from "@apollo/client";
import {
  DndContext,
  useSensor,
  useSensors,
  PointerSensor,
  TouchSensor,
} from "@dnd-kit/core";
import { Loader2 } from "lucide-react";
import { GET_NFTS } from "../app/graphql";
import NFTCard from "../components/Card";
import { DragStartEvent } from "@dnd-kit/core";

const calculateLayout = (containerWidth: number) => {
  const minCardWidth = 150;
  const maxCols = Math.floor(containerWidth / minCardWidth);
  const size = Math.floor(containerWidth / maxCols);
  const offsetX = (containerWidth - size * maxCols) / 2;
  return { cols: maxCols, size, offsetX };
};

const detectSensor = () => {
  const isWebEntry = JSON.parse(sessionStorage.getItem("isWebEntry") as string);
  return isWebEntry ? PointerSensor : TouchSensor;
};

const NFTGrid = ({
  wallet,
  nftCount,
  bgImage,
}: {
  wallet: string;
  nftCount: number;
  bgImage: string;
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [nfts, setNfts] = useState<any[]>([]);
  const [cardSize, setCardSize] = useState(200);
  const [dragId, setDragId] = useState<string | null>(null);
  const [layout, setLayout] = useState({ cols: 0, offsetX: 0 });

  const sensors = useSensors(useSensor(detectSensor()));

  const { loading, error, data } = useQuery(GET_NFTS, {
    variables: { owner: wallet, limit: nftCount },
    skip: !wallet,
  });

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const { cols, size, offsetX } = calculateLayout(containerWidth);
        setLayout({ cols, offsetX });
        setNfts((current: any[]) =>
          current.map((nft: any, i: number) => ({
            ...nft,
            x: (i % cols) * size + offsetX + 10,
            y: Math.floor(i / cols) * size + 10,
          }))
        );
        setCardSize(size);
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize();
    return () => window.removeEventListener("resize", handleResize);
  }, [nftCount]);

  useEffect(() => {
    if (data?.tokens?.tokens) {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        const { cols, size, offsetX } = calculateLayout(containerWidth);
        setLayout({ cols, offsetX });
        setNfts(
          data.tokens.tokens.map((nft: any, i: number) => ({
            ...nft,
            x: (i % cols) * size + offsetX + 10,
            y: Math.floor(i / cols) * size + 10,
          }))
        );
        setCardSize(size);
      }
    }
  }, [data, nftCount]);

  const handleDragStart = (event: DragStartEvent) =>
    setDragId(event.active.id.toString());

  const handleDragEnd = (event: { active: any; delta: any }) => {
    const { active, delta } = event;
    const { offsetX } = layout;
    setDragId(null);

    setNfts((current: any) => {
      const activeNft = current.find(
        (nft: { id: any }) => nft.id === active.id
      );
      if (!activeNft) return current;

      const snap = (
        value: number,
        size: number,
        offset: number,
        margin: number
      ) =>
        Math.round((value - offset - margin) / size) * size + offset + margin;

      const newX = snap(activeNft.x + delta.x, cardSize, offsetX, 10);
      const newY = snap(activeNft.y + delta.y, cardSize, 0, 10);

      return current.map((nft: { id: any; x: any; y: any }) => {
        if (nft.id === active.id) {
          return { ...nft, x: newX, y: newY };
        }
        if (nft.x === newX && nft.y === newY) {
          return { ...nft, x: activeNft.x, y: activeNft.y };
        }
        return nft;
      });
    });
  };

  const removeNFT = useCallback((id: any) => {
    if (containerRef.current) {
      const containerWidth = containerRef.current.offsetWidth;
      setNfts((current: any) => {
        const newNfts = current.filter((nft: { id: any }) => nft.id !== id);
        const { cols, size, offsetX } = calculateLayout(containerWidth);
        return newNfts.map((nft: any, i: number) => ({
          ...nft,
          x: (i % cols) * size + offsetX + 10,
          y: Math.floor(i / cols) * size + 10,
        }));
      });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex-grow relative overflow-auto touch-action-none" // Add touch-action-none to prevent scrolling
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      )}
      {error && (
        <p className="text-red-500 p-4">Error fetching NFTs: {error.message}</p>
      )}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div
          className="absolute inset-0"
          style={{ backgroundSize: `${cardSize}px ${cardSize}px` }}
        >
          {nfts.map((nft) => (
            <NFTCard
              key={nft.id}
              nft={nft}
              onRemove={removeNFT}
              size={cardSize}
              isDragging={nft.id === dragId}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
};

export default NFTGrid;
