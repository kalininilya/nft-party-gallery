import React, { useState, useEffect, useCallback } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Image from "./Image";

const MARGIN = 10;
const GLOW_DURATION = 3000;
const GLOW_INTERVAL = 5000;
const GLOW_CHANCE = 0.1;
const TEXT_AREA_HEIGHT = 60;

const NFTCard = ({
  nft,
  onRemove,
  size,
  isDragging,
}: {
  nft: any;
  onRemove: any;
  size: any;
  isDragging: boolean;
}) => {
  const [isGlowing, setIsGlowing] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef: setDragRef,
    transform,
  } = useDraggable({ id: nft.id });

  const { setNodeRef: setDropRef } = useDroppable({ id: nft.id });

  const setRef = useCallback(
    (node: HTMLElement | null) => {
      setDragRef(node);
      setDropRef(node);
    },
    [setDragRef, setDropRef]
  );

  useEffect(() => {
    const triggerGlow = () => {
      setIsGlowing(true);
      setTimeout(() => setIsGlowing(false), GLOW_DURATION);
    };

    const interval = setInterval(() => {
      if (Math.random() < GLOW_CHANCE) {
        triggerGlow();
      }
    }, GLOW_INTERVAL);

    return () => clearInterval(interval);
  }, []);

  const cardStyle: React.CSSProperties = {
    width: size - MARGIN * 2,
    height: size - MARGIN * 2,
    margin: MARGIN,
    position: "absolute",
    top: 0,
    left: 0,
    transition: isDragging ? "none" : "transform 0.3s ease-in-out",
    transform: transform
      ? `translate3d(${nft.x + transform.x}px, ${nft.y + transform.y}px, 0)`
      : `translate3d(${nft.x}px, ${nft.y}px, 0)`,
    zIndex: isDragging ? 1000 : 1,
    cursor: "move",
    touchAction: "none", // https://docs.dndkit.com/api-documentation/sensors/pointer#touch-action
  };

  return (
    <Card
      ref={setRef}
      style={cardStyle}
      {...attributes}
      {...listeners}
      className={`overflow-hidden group relative ${isGlowing ? "glow" : ""}`}
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 opacity-75 blur"></div>
      <div className="relative z-10 bg-gray-900 h-full flex flex-col">
        <div className="flex-grow relative">
          {nft.media?.type === "video" ? (
            <video
              src={nft.media?.url}
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
            />
          ) : (
            <Image
              src={nft.media?.url || "https://via.placeholder.com/200"}
              alt={nft.name}
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-gray-900 to-transparent"></div>
        </div>
        <CardContent
          className="p-2 bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col justify-center"
          style={{ height: TEXT_AREA_HEIGHT }}
        >
          <p className="text-sm font-bold leading-tight truncate text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            {nft.name}
          </p>
          <p className="text-xs leading-tight truncate text-gray-400">
            {nft.collection?.name}
          </p>
        </CardContent>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-2 right-2 bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity z-20"
        onClick={() => onRemove(nft.id)}
      >
        <X className="h-4 w-4" />
      </Button>
      <style jsx>{`
        .glow {
          animation: glow 3s ease-in-out;
        }
        @keyframes glow {
          0%,
          100% {
            box-shadow: 0 0 5px rgba(255, 255, 255, 0.2);
          }
          50% {
            box-shadow: 0 0 20px rgba(255, 255, 255, 0.8);
          }
        }
      `}</style>
    </Card>
  );
};

export default NFTCard;
