import Link from "next/link";
import { IoIosSearch } from "react-icons/io";
const HeaderSearch = () => {
  return (
    <Link
      href={"/browse"}
      className="flex items-center justify-between rounded-2xl"
    >
      <IoIosSearch className="h-8 w-8" />
    </Link>
  );
};

export default HeaderSearch;
