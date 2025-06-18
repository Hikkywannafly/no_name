import { FaUserAlt } from "react-icons/fa";

const HeaderUser = () => {
  return (
    <div className="flex max-h-[35px] items-center justify-center rounded-full bg-gray-800 p-3">
      <FaUserAlt className="h-5 w-5" />
    </div>
  );
};

export default HeaderUser;
