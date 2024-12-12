import React, { useState } from "react";
import { MdAdd, MdClose } from "react-icons/md";

const TagInput = (props) => {
  const [inputValue, setInputValue] = useState("");



  const handleClose = (tagSelected) => {
    const tagToRemove = props.tags.filter((_, index) => index !== tagSelected) 
    props.setTags(tagToRemove);
  };

  const handleTags = () => {
    props.setTags([...props.tags, inputValue]) 
    setInputValue("");
  }

  return (
    <div>
      {props.tags?.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap mt-2">
          {props.tags.map((x, index) => (
            <span
              key={index}
              className="flex items-center gap-2 text-sm text-slate-900  bg-slate-100 px-3 py1 rounded"
            >
              # {x}
              <button
                onClick={() => {
                  handleClose(index);
                }}
              >
                {" "}
                <MdClose />{" "}
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center gap-4 mt-3">
        <input
          type="text"
          className="text-sm bg-transparent border px-3 py-2 rounded outline-none"
          placeholder="Add tags"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button className="flex items-center justify-center rounded border border-blue-500 hover:bg-blue-500">
          <MdAdd
            className="text-2xl text-blue-700 hover:text-white "
            onClick={handleTags}
          />
        </button>
      </div>
    </div>
  );
};
  
export default TagInput;
