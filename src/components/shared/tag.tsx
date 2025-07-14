import classNames from "classnames";
import { motion } from "framer-motion";
import Link from "next/link";
import type React from "react";

interface TagProps {
  className?: string;
  children: React.ReactNode;
}

const Tag: React.FC<TagProps> = ({ children, className }) => {
  return (
    <div className={classNames("flex items-center", className)}>{children}</div>
  );
};

interface TagItemProps {
  className?: string;
  active?: boolean;
  href: string;
  children: React.ReactNode;
}

export const TagItem: React.FC<TagItemProps> = ({
  className,
  children,
  active,
  href,
}) => {
  return (
    <Link scroll={false} href={href}>
      <span
        className={classNames(
          "relative flex items-center justify-center rounded-sm px-2 py-1 font-medium",
          active
            ? "text-primary-500"
            : "text-gray-400 transition duration-300 hover:bg-gray-600/20",
          className,
        )}
      >
        {children}

        {active && (
          <motion.div
            animate
            layoutId="tag-underline"
            className={classNames(
              "absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-primary-500",
            )}
          />
        )}
      </span>
    </Link>
  );
};

export default Tag;
