import { HeaderSearch, HeaderUser } from '@/components/icons';
import HamburgerMenu from '@/components/icons/HamburgerMenu';
import DropDown from '@/components/shared/DropDown';
import { GENRES_COMICS, RANKING_COMICS } from '@/constants';
import Link from 'next/link';
import React, { useState } from 'react';
import { IoIosArrowDown } from 'react-icons/io';
type NavItemProps = {
    label: string,

}
const NavItem = ({ label }: NavItemProps) => (
    <li className="">
        <div className="flex transform cursor-pointer items-center font-bold opacity-80 transition-all duration-300 hover:text-highlight">
            {label}
        </div>
    </li>
)
const Header = () => {

    const [isOpenGenre, setIsOpenGenre] = useState(false);
    const [isOpenRanking, setIsOpenRanking] = useState(false);

    return (
        <React.Fragment>
            <header className="fixed top-0 left-0 z-[999] w-full bg-gradient-to-b from-black/60 via-black/40 to-transparent p-4 px-2 transition duration-500 ">
                <div className="mx-auto flex h-full w-full items-center justify-between md:max-w-[644px] lg:max-w-[1200px] ">
                    <div className='absolute inset-0 '> </div>
                    <div className="flex items-center ">
                        <HamburgerMenu />
                        <Link href='/' className="transform cursor-pointer font-semibold text-xl opacity-80 transition duration-300 ">
                            HikkyManga
                        </Link>
                    </div>

                    <nav className=" hidden md:block">
                        <ul className="flex items-center space-x-8">
                            <li
                                onClick={() => setIsOpenGenre(!isOpenGenre)}
                                className="relative transform cursor-pointer transition duration-300">
                                <div className={`flex items-center gap-1 font-bold opacity-80 ${isOpenGenre ? 'text-highlight' : null}`}>
                                    Thể loại <IoIosArrowDown className="h-3 w-3 font-bold" />
                                </div>
                                <DropDown
                                    options={GENRES_COMICS}
                                    show={isOpenGenre}
                                    isMore={false}
                                    onClose={() => setIsOpenGenre(false)}
                                />
                            </li>

                            <li
                                onClick={() => setIsOpenRanking(!isOpenRanking)}
                                className="relative transform cursor-pointer transition duration-300 ">
                                <div className={`flex items-center gap-1 font-bold opacity-80 ${isOpenRanking ? 'text-highlight' : null}`}>
                                    Xếp hạng <IoIosArrowDown className="h-3 w-3 font-bold" />
                                </div>
                                <DropDown
                                    options={RANKING_COMICS}
                                    show={isOpenRanking}
                                    isMore={false}
                                    onClose={() => setIsOpenRanking(false)}
                                />
                            </li>

                            <NavItem label="Truyện mới" />
                        </ul>
                    </nav>

                    <div className="z-30 flex gap-3 ">
                        <HeaderSearch />
                        <HeaderUser />
                    </div>
                </div>
            </header>
        </React.Fragment >
    )
}

export default Header