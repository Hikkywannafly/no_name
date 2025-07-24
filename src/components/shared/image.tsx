import { motion } from "framer-motion";
import NextImage, { type ImageProps as NextImageProps } from "next/image";
import React, { useCallback, useState } from "react";

const variants = {
  hidden: {
    opacity: 0,
  },

  visible: {
    opacity: 1,
  },
};

interface ImageProps extends NextImageProps {
  containerClassName?: string;
}

const Image: React.FC<ImageProps> = ({ onLoad, ...props }) => {
  const { containerClassName } = props;

  const [isLoaded, setIsLoaded] = useState(false);

  const handleLoad: React.ReactEventHandler<HTMLImageElement> = useCallback(
    (event) => {
      setIsLoaded(true);
      onLoad?.(event);
    },
    [onLoad],
  );

  return (
    <motion.div
      initial="hidden"
      variants={variants}
      animate={isLoaded ? "visible" : "hidden"}
      className={containerClassName}
    >
      {isLoaded && (
        <div
          className={
            "flex h-60 w-full flex-col items-center justify-center gap-2 text-gray-500"
          }
        >
          <img
            className="w-12 animate-pulse"
            src="/images/nazuna1.gif"
            alt="nazuna1"
          />
          <p>Đợi chút nhé...</p>
        </div>
      )}

      <NextImage onLoad={handleLoad} unoptimized {...props} />
    </motion.div>
  );
};

export default React.memo(Image);
