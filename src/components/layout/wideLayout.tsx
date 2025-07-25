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
        className={`mx-auto max-w-full px-8 ${ultraWide ? "w-[1600px] sm:px-16" : "sm:px-8 lg:max-w-[1200px] xl:max-w-[1400px] "} ${classNames || ""}`}
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

// import classNames from "classnames";
// import React from "react";

// export interface SectionProps {
//     title?: string;
//     className?: string;
//     children?: React.ReactNode;
//     isLoading?: boolean;
//     hasPadding?: boolean;
// }

// const Section = React.forwardRef<HTMLDivElement, SectionProps>(
//     ({ children, title, className, hasPadding = true }, ref) => {
//         return (
//             <div
//                 ref={ref}
//                 className={classNames(
//                     hasPadding && "px-4 md:px-12 lg:px-20 xl:px-28 2xl:px-36",
//                     className
//                 )}
//             >
//                 {title && (
//                     <h1 className="mb-4 font-semibold text-xl ">{title}</h1>
//                 )}

//                 {children}
//             </div>
//         );
//     }
// );

// Section.displayName = "Section";

// export default React.memo(Section);
