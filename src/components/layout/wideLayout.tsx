import type { ReactNode } from "react";

interface WideContainerProps {
  classNames?: string;
  children?: ReactNode;
  ultraWide?: boolean;
}

export function WideContainer(props: WideContainerProps) {
  return (
    <div
      className={`mx-auto max-w-full px-8 ${
        props.ultraWide ? "w-[1600px] sm:px-16" : "sm:px-8 lg:max-w-[1200px]"
      } ${props.classNames || ""}`}
    >
      {props.children}
    </div>
  );
}
