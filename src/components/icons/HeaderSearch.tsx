import { IoIosSearch } from "react-icons/io";

const HeaderSearch = () => {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-black/40 px-2 transition-all duration-300 hover:bg-black/60">
      <IoIosSearch className="h-8 w-8" />
    </div>
  );
};

export default HeaderSearch;
