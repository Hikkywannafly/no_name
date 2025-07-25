import dynamic from "next/dynamic";

const Select = dynamic(() => import("./browseSelect"), { ssr: false });

export default Select;
