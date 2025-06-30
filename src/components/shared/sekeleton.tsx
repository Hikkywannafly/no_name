import classNames from "classnames";
import React from "react";

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div ref={ref} className={classNames(className)} {...props}>
        {props.children}
      </div>
    );
  },
);
Skeleton.displayName = "Skeleton";

interface skeletonItemProps extends React.HTMLProps<HTMLDivElement> {
  className?: string;
  container?: boolean;
}

export const SkeletonItem: React.FC<skeletonItemProps> = ({
  container,
  className,
  ...props
}) => {
  return (
    <div
      className={classNames(
        container && "animate-pulse bg-white/20",
        className,
      )}
      {...props}
    />
  );
};

export default Skeleton;
