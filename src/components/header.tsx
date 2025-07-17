"use client";
import { HeaderSearch, HeaderUser } from "@/components/icons";
import HamburgerMenu from "@/components/icons/HamburgerMenu";
import DropDown from "@/components/shared/dropDown";
import { GENRES_COMICS, RANKING_COMICS } from "@/constants";
import Link from "next/link";
import React, { useCallback, useState } from "react";
import { BsCaretDownFill } from "react-icons/bs";

type NavItemProps = {
  label: string;
};

const NavItem = ({ label }: NavItemProps) => (
  <li className="">
    <div className="flex items-center whitespace-nowrap font-bold opacity-80 transition-all duration-300 hover:text-highlight">
      {label}
    </div>
  </li>
);

const Header = () => {
  const [dropdown, setDropdown] = useState<{
    genre: boolean;
    ranking: boolean;
  }>({ genre: false, ranking: false });
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleDropdown = useCallback((key: "genre" | "ranking") => {
    setDropdown((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const closeDropdown = useCallback((key: "genre" | "ranking") => {
    setDropdown((prev) => ({ ...prev, [key]: false }));
  }, []);

  return (
    <React.Fragment>
      <header className="fixed top-0 left-0 z-[999] w-full bg-gradient-to-b from-black/60 via-black/40 to-transparent p-4 px-2 transition duration-500 ">
        <div className="mx-auto flex h-full w-full items-center justify-between lg:max-w-[1200px]">
          <div className="flex items-center ">
            <button
              className="mr-2 block md:hidden"
              onClick={() => setIsMobileMenuOpen(true)}
              aria-label="Open menu"
              type="button"
            >
              <HamburgerMenu />
            </button>
            <Link
              href="/"
              className="cursor-pointer whitespace-nowrap font-semibold text-xl opacity-80"
            >
              NONAMEE
            </Link>
          </div>

          <nav className="hidden md:block">
            <ul className=" flex flex-row items-center gap-4 space-x-4 px-2 md:space-x-8">
              <NavItem label="Light Novel" />
              <li
                onClick={(e) => {
                  e.stopPropagation();
                  handleDropdown("genre");
                }}
                className="relative transform cursor-pointer transition duration-300"
              >
                <div
                  className={`flex items-center gap-1 whitespace-nowrap font-bold opacity-80 ${dropdown.genre ? "text-highlight" : null}`}
                >
                  Thể loại <BsCaretDownFill className="h-3 w-3 font-bold" />
                </div>
                <DropDown
                  options={GENRES_COMICS}
                  show={dropdown.genre}
                  isMore={false}
                  onClose={() => closeDropdown("genre")}
                />
              </li>
              <li
                onClick={() => handleDropdown("ranking")}
                className="relative transform cursor-pointer transition duration-300 "
              >
                <div
                  className={`flex items-center gap-1 whitespace-nowrap font-bold opacity-80 ${dropdown.ranking ? "text-highlight" : null}`}
                >
                  Xếp hạng <BsCaretDownFill className="h-3 w-3 font-bold" />
                </div>
                <DropDown
                  options={RANKING_COMICS}
                  show={dropdown.ranking}
                  isMore={false}
                  onClose={() => closeDropdown("ranking")}
                />
              </li>
              <NavItem label="Đăng truyện" />
              {/* <NavItem label="Discord" /> */}
            </ul>
          </nav>

          <div className="z-30 flex gap-3 whitespace-nowrap">
            <HeaderSearch />
            <HeaderUser />
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[1000] flex flex-col bg-black/80 md:hidden">
          <div className="flex items-center justify-between border-white/10 border-b p-4">
            <span className="font-semibold text-white text-xl">NONAME</span>
            <button
              className="text-2xl text-white"
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
              type="button"
            >
              ×
            </button>
          </div>
          <nav className="flex flex-1 flex-col gap-2 p-6 text-white">
            <button
              className="py-2 text-left"
              onClick={() => setIsMobileMenuOpen(false)}
              type="button"
            >
              Light Novel
            </button>
            <div className="py-2">
              <div className="flex items-center gap-1 font-bold opacity-80">
                Thể loại <BsCaretDownFill className="h-3 w-3 font-bold" />
              </div>
              <DropDown
                options={GENRES_COMICS}
                show={true}
                isMore={false}
                onClose={() => {}}
              />
            </div>
            <div className="py-2">
              <div className="flex items-center gap-1 font-bold opacity-80">
                Xếp hạng <BsCaretDownFill className="h-3 w-3 font-bold" />
              </div>
              <DropDown
                options={RANKING_COMICS}
                show={true}
                isMore={false}
                onClose={() => {}}
              />
            </div>
            <button
              className="py-2 text-left"
              onClick={() => setIsMobileMenuOpen(false)}
              type="button"
            >
              Đăng truyện
            </button>
            <button
              className="py-2 text-left"
              onClick={() => setIsMobileMenuOpen(false)}
              type="button"
            >
              Discord
            </button>
          </nav>
          <div className="flex justify-center gap-4 pb-6">
            <HeaderSearch />
            <HeaderUser />
          </div>
        </div>
      )}
    </React.Fragment>
  );
};

export default Header;
