import moment from "moment";
import React from "react";
import { MdCreate, MdDelete, MdOutlinePushPin } from "react-icons/md";

const NoteCard = (props) => {
  return (
    <div className="border rounded p-4 mt-4 bg-white hover:shadow-lg transition-all ease-in-out">
      <div className="flex items-center justify-between">
        <div>
          <h6 className="text-sm font-medium">{props.title}</h6>
          <span className="text-xs text-slate-500 ">{moment(props.note).format("Do MMM YYYY")}</span>
        </div>
        <MdOutlinePushPin
          className={`icon-btn ${
            props.isPinned ? "text-primary" : "text-slate-300"
          }`}
          onClick={props.onPinNote}
        />
      </div>

      <p className="text-xs text-slate-600 mt-2">    {props.content?.split('\n').map((line, index) =>
        index === props.content.split('\n').length - 1 ? line : [line, <br key={index} />])}</p>
      <div className="flex items-center justify-between mt-2">
        <div className="text-xs text-slate-500">{props.tags.map((note) => ` #${note} `)}</div>

        <div className="flex items-center gap-2">
          <MdCreate
            className="icon-btn hover:text-green-600"
            onClick={props.onEdit}
          />
          <MdDelete
            className="icon-btn hover:text-red-600"
            onClick={props.onDelete}
          />
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
