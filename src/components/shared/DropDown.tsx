import { useClickOutside } from "@/hooks/useClickOutside";
import Link from "next/link";
import { type FC, useCallback, useRef, useState } from "react";
import { IoIosArrowForward } from "react-icons/io";

export type DropDownItem = {
  label: string;
  href: string;
};

type DropDownConfig = {
  options: DropDownItem[];
  isMore: boolean;
};

type DropDownState = {
  show: boolean;
  onClose: () => void;
};

export interface DropDownProps extends DropDownConfig, DropDownState { }

const DropDown: FC<DropDownProps> = ({ options, show, isMore, onClose }) => {
  const [offsetTop, setOffsetTop] = useState<number | null>(null);
  const effectActive = useRef<HTMLLIElement>(null);
  const dropdownRef = useRef<HTMLUListElement>(null);

  const handleClose = useCallback(() => {
    onClose();
    setOffsetTop(null);
  }, [onClose]);

  useClickOutside(dropdownRef, handleClose, show);

  const handleMouseEnter = useCallback((e: React.MouseEvent<HTMLLIElement>) => {
    const target = e.currentTarget;
    setOffsetTop(target.offsetTop);
    if (effectActive.current) {
      effectActive.current.style.transform = `translateY(${target.offsetTop}px)`;
    }
  }, []);

  if (!show) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/40"
        onClick={handleClose}
        aria-label="Close dropdown overlay"
      />
      <ul
        ref={dropdownRef}
        className="-translate-x-1/2 absolute top-full left-1/2 z-50 flex h-fit w-fit animate-fade flex-col flex-nowrap items-start justify-evenly rounded-lg bg-slate-800 p-2 text-white backdrop-blur-sm transition-all"
        onMouseLeave={() => setOffsetTop(null)}
      >
        {options.map((item, index) => (
          <li
            key={index}
            onMouseEnter={handleMouseEnter}
          >
            <div>
              <Link
                href={item.href}
                className="absolute-center top-2 mx-2 my-2 h-8 whitespace-nowrap px-3 duration-300 hover:text-highlight"
              >
                {item.label}
                {isMore && index === options.length - 1 && (
                  <IoIosArrowForward className="h-3 w-3" />
                )}
              </Link>
            </div>
          </li>
        ))}
        <li
          ref={effectActive}
          className={`slide -z-10 absolute top-[-3px] h-7 w-[85%] rounded-lg bg-slate-600 px-6 duration-150 ${offsetTop === null ? "opacity-0" : ""}`}
        />
      </ul>
    </>
  );
};

export default DropDown;
