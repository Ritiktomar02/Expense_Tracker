import React, { useState } from "react";
import { HiOutlineMenu, HiOutlineX } from "react-icons/hi";
import SideMenu from "./SideMenu";

const Navbar = ({ activemenu }) => {
  const [opensidemnenu, setopensidemnenu] = useState(null);
  return (
    <div className="flex gap-5 bg-white border boredr-b border-gray-200/50 backdrop-blur-[2px] py-4 px-7 sticky top-0 z-3 ">
      <button
        className="block lg:hidden text-black"
        onClick={() => {
          setopensidemnenu(!opensidemnenu);
        }}
      >
        {opensidemnenu ? (
          <HiOutlineX className="text-2xl" />
        ) : (
          <HiOutlineMenu className="text-2xl" />
        )}
      </button>

      <h2 className="text-lg font-medium text-black">Expense Tracker</h2>

      {opensidemnenu && (
        <div className="fixed top-[61px] -ml-4 bg-white">
          <SideMenu activemenu={activemenu} />
        </div>
      )}
    </div>
  );
};

export default Navbar;
