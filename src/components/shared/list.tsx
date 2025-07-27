import classNames from "classnames";
import React, { useMemo } from "react";

export type ArrayElement<ArrayType extends any[]> = ArrayType[number];

interface ListProps<T extends any[]>
  extends Omit<React.HTMLAttributes<HTMLDivElement>, "children"> {
  data: T;
  children: (data: ArrayElement<T>) => React.ReactNode;
  noListMessage?: React.ReactNode;
}

const defaultClassName =
  "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7";

const List = <T extends any[]>({
  data,
  children,
  className = "",
  noListMessage = "No data.",
  ...props
}: ListProps<T>) => {
  const validClassName = useMemo(
    () => (className.includes("grid-cols") ? className : defaultClassName),
    [className],
  );

  return (
    <div
      className={classNames(
        data.length ? "grid gap-3" : "text-center",
        validClassName,
      )}
      {...props}
    >
      {data.length ? (
        data.map((item, index) => (
          <div className="col-span-1" key={item?.id || index}>
            {children(item)}
          </div>
        ))
      ) : (
        <p className="text-2xl">{noListMessage}</p>
      )}
    </div>
  );
};

export default React.memo(List) as typeof List;
