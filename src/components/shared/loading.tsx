import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

interface LoadingProps {
  className?: string;
}

const Loading: React.FC<LoadingProps> = ({ className = "" }) => {
  let loadingClassName = "animate-spin text-primary-500";

  if (className.includes("w-") && className.includes("h-")) {
    loadingClassName += ` ${className}`;
  } else {
    loadingClassName += "h-16 w-16";
  }

  return (
    <div className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2">
      <AiOutlineLoading3Quarters className={loadingClassName} />
    </div>
  );
};

export default React.memo(Loading);
