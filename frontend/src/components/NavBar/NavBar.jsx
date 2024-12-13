import React, { useState } from "react";
import ProfileCard from "../Cards/ProfileCard";
import { useNavigate } from "react-router-dom";
import SearchBar from "../SearchBar/SearchBar";

// NavBar.jsx :
const NavBar = (props) => {
  const [searchQuery, setSearchQuery] = useState("");
  const handleSearch = () => {
    if(searchQuery){
      props.onSearchNote(searchQuery)
    }
  };


  const handleClearSearch = () => {
    setSearchQuery("");
    props.handleClearSearch();
  };

  const navigate = useNavigate();
  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };
  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      <h2 className="text-xl font-medium text-black py-2">Notes</h2>

      <SearchBar
        value={searchQuery}
        handleClearSearch={handleClearSearch}
        onChange={({ target }) => setSearchQuery(target.value)}
        handleSearch={handleSearch}
      />
      <ProfileCard  fullName={props.userInfos?.fullName} onLogout={onLogout} />
    </div>
  );
};

export default NavBar;
