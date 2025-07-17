import classNames from "classnames";
import type React from "react";

interface InfoItemProps {
  title: string;
  value?: string | number | React.ReactNode;
  className?: string;
}

const InfoItem: React.FC<InfoItemProps> = ({ title, value, className }) => {
  return value ? (
    <div className={classNames("text-gray-400", className)}>
      <p className="font-semibold">{title}</p>
      <p className="flex flex-row gap-2 whitespace-pre-line md:flex-col">
        {value}
      </p>
    </div>
  ) : null;
};

export default InfoItem;
