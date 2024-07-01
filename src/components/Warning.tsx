import React, { useState, useEffect } from "react";

const Warning = () => {
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setShowAnimation(true);
      setTimeout(() => {
        setShowAnimation(false);
      }, 5000);
    }, Math.floor(Math.random() * (10000 - 5000 + 1)) + 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full items-center bg-transparent cursor-pointer animate-[pulse_3s_ease-in-out_infinite]">
      <div className="space-y-0 text-right m-2">
        <p
          className={`text-5xl font-bold tracking-wider text-[#00ffff] drop-shadow-[0_0_10px_rgba(0,255,255,0.8)] uppercase ${
            showAnimation
              ? "animate-[rewrite_2s_ease-in-out_forwards,delete_2s_ease-in-out_2s_forwards,rewrite_2s_ease-in-out_4s_infinite]"
              : ""
          }`}
        >
          CONVEXITY LABS
        </p>
        <p
          className={`text-2xl font-bold tracking-wider text-[#ff00ff] drop-shadow-[0_0_10px_rgba(255,0,255,0.8)] uppercase ${
            showAnimation
              ? "animate-[rewrite_2s_ease-in-out_forwards,delete_2s_ease-in-out_2s_forwards,rewrite_2s_ease-in-out_4s_infinite]"
              : ""
          }`}
        >
          SYSTEM ALERT: PARTY IN PROGRESS
        </p>
      </div>
    </div>
  );
};

export default Warning;
