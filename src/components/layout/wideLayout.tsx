import type { ReactNode } from "react";
import React from "react";
import { Label } from "../ui/label";

interface WideContainerProps {
  title?: string;
  classNames?: string;
  children?: ReactNode;
  ultraWide?: boolean;
}

const WideContainer = React.forwardRef<HTMLDivElement, WideContainerProps>(
  (props, ref) => {
    const { children, title, classNames, ultraWide = false } = props;
    return (
      <div
        ref={ref}
        className={`mx-auto max-w-full px-2 sm:px-8 ${ultraWide ? "w-[1600px] sm:px-16" : "lg:max-w-[1200px] xl:max-w-[1200px] "} ${classNames || ""}`}
      >
        {title && (
          <Label className="mb-4 font-semibold text-xl ">{title}</Label>
        )}
        {children}
      </div>
    );
  },
);

export default WideContainer;
