import React, { useState } from "react";
import NextImage from "next/image";

const Image = ({
  src,
  alt,
  className,
}: {
  src: string;
  alt: string;
  className: string;
}) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <div className={`${className} relative`}>
      <NextImage
        src={src}
        alt={alt}
        layout="fill"
        objectFit="cover"
        className={`transition-opacity duration-500 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoadingComplete={() => setLoaded(true)}
      />
    </div>
  );
};

export default Image;
