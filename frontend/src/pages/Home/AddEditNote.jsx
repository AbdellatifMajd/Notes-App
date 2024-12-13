import React, { useState } from "react";
import TagInput from "../../components/Inputs/TagInput";
import { MdClose } from "react-icons/md";
import axiosInstance from "../../utils/axiosinstance";

const AddEditNote = (props) => {
  const [tags, setTags] = useState(props.noteData?.tags || []);
  const [error, setError] = useState(""); 
  const [title, setTitle] = useState(props.noteData?.title || "")
  const [content, setContent] = useState(props.noteData?.content || "");

// addNewNote function
const addNewNote = async () => {
  try {
    const response = await axiosInstance.post("/add-note", {title:title, content:content, tags:tags});
    if(response.data && response.data.note){
      props.GetAllNotes(response.data)
      props.onClose();
      props.handleShowToastMsg("Note Added Successfully.")
    } 


  }
  catch(error){
    if(error.response && error.response.data && error.response.data.message){
      setError(error.response.data.message)
    }
  }
}



// editNote function 
const editNote = async () => {
  const noteId = props.noteData._id ;
  try{
    const response = await axiosInstance.put("/edit-note/"+noteId, {title:title, content:content, tags:tags})
    if(response.data && response.data.note){
      props.GetAllNotes(); 
      props.onClose();
      props.handleShowToastMsg("Note Updated Successfully.")
    }
  }
  catch(error){
    if(error.response && error.response.data && error.response.data.message){
      setError(error.response.data.message)
    }
  }

}







  const errorAddNote = () => {
    if (!title){
      setError("please enter a title")
      return
    }

    if(!content){
      setError("please enter a content")
      return
    }

    setError("")





    if(props.type === "edit"){
      editNote()
    }
    else{
      addNewNote()
    }



  }



  return (
    <div className="relative">
      <button className="w-8 h-8 rounded-full flex items-center justify-center absolute -right-3 -top-3 hover:bg-slate-100" onClick={props.onClose}>
        <MdClose className="text-slate-400 text-xl"/>
      </button>

      <div className="flex flex-col gap-2">
        <label className="input-label">Title</label>
        <input
          type="text"
          className="text-sm text-slate-950 outline-none bg-slate-100 rounded p-3"
          placeholder="Go to gym at 5 pm"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="flex flex-col gap-2 mt-4">
        <label className="input-label">Content</label>
        <textarea
          className="text-sm text-slate-950 outline-none bg-slate-100 rounded-md p-3"
          placeholder="Content"
          rows={10}
          value={content} 
          onChange={(e) => setContent(e.target.value)}
        ></textarea>
      </div>


      <div className="mt-3">
        <TagInput tags={tags} setTags={setTags}/>

        <div className="mt-10 text-red-300 text-sm">
          {error}
        </div>

      </div>

      <button className="btn-primary font-medium mt-5 p-3" onClick={() => {errorAddNote()}}>
        {props.type === "edit" ? "UPDATE " : "ADD"}
      </button>
    </div>
  );
};

export default AddEditNote;