import React from "react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";

const SearchBar = ( props ) => {

  return (
    <div className="w-80 flex items-center px-4 bg-slate-200 rounded-md">
      <input
        type="text"
        placeholder="Search notes"
        className="w-full text-xs bg-transparent py-[11px] outline-none "
        value={props.value}
        onChange={props.onChange}
      />
      {props.value && (
        <IoMdClose className="text-xl text-slate-500 cursor-pointer hover:text-black mr-3" onClick={props.handleClearSearch}/>
      )}
      <FaMagnifyingGlass className="text-slate-400 cursor-pointer hover:text-black" onClick={props.handleSearch}/>
    </div>
  );
};

export default SearchBar;