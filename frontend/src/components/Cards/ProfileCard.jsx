import React from "react";
import { getInitials } from "../../utils/helper";

// ProfileBar.jsx : 
const ProfileCard = (props) => {
  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-200">
        {getInitials(props.fullName)}
      </div>
      <div>
        <p className="text-sm font-medium">{props.fullName}</p>
        <button
          onClick={props.onLogout}
          className="text-sm text-slate-700 underline"
        >
          Logout {" "}
        </button>
      </div>
    </div>
  );
};

export default ProfileCard;
