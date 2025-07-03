import { IoIosSearch } from "react-icons/io";

const HeaderSearch = () => {
  // const setShowSearchModal = useSetAtom(showSearchModalAtom)
  // const handleShowSearchModal = () => {
  //     setShowSearchModal(true)
  // }

  return (
    // <div
    //   // onClick={handleShowSearchModal}
    //   className="flex items-center justify-between rounded-2xl bg-gray-800 "
    // >
    //   <input
    //     readOnly
    //     className="mx-4 hidden bg-transparent placeholder:text-white md:block"
    //     placeholdermx-4="Tìm truyện..."
    //   />
    //   {/* <div className=" mx-3 flex gap-2 text-base">
    //             <div className="hidden rounded-lg bg-tertiary px-2 py-1 font-semibold md:block">
    //                 Ctrlpy-1
    //             </div>
    //             <div className="hidden rounded-lg bg-tertiary px-2 py-1 font-semibold md:block">
    //                 Kpy-1
    //             </div>
    //         </div> */}

    //   <button
    //     type="button"
    //     className="h-full rounded-2xl px-4 hover:cursor-pointer hover:opacity-60"
    //   >
    //     <IoIosSearch className="h-8 w-8" />
    //   </button>
    // </div>
    <div className="flex items-center justify-between rounded-2xl bg-gray-800 px-2">
      <IoIosSearch className="h-8 w-8" />


    </div>
  );
};

export default HeaderSearch;
