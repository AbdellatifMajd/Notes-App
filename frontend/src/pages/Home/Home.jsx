import React, { useState, useEffect } from "react";
import NavBar from "../../components/NavBar/NavBar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import moment from "moment" ;
import AddEditNote from "./AddEditNote";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosinstance";
import Toast from "../../components/ToastMessage/Toast";

const Home = () => {
  const [openAddEditModal, setopenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false, 
    message:"",
    type: "add"
  })


  const [userInfos, setUserInfos] = useState([]); 
  const [allNotes, setAllNotes] = useState([]);
  const [isSearch, setIsSearch] = useState(false); 



  const handleShowToastMsg = (msg, type) => {
    setShowToastMsg({
      isShown: true, 
      message: msg, 
      type: type
    })
  }

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false, 
      message: ""
    })
  }

  const onClose = () => {};




  const navigate = useNavigate() 

  const handleEdit = (noteDetails) => {
    setopenAddEditModal({isShown: true, data: noteDetails, type: "edit"})
  }

  // get user infos 
  const GetUserInfos = async()=>{
    
    try{
      const response = await axiosInstance.get("/get-user") 
      if(response.data && response.data.user){
        setUserInfos(response.data.user)
      }
    }
    catch(error){
      if(error.response.status=== 401){
        localStorage.clear(); 
        navigate("/login") 
      }
    }
  }



    // get all notes 
    const GetAllNotes = async () => {
      try{
        const response = await axiosInstance.get("/get-all-notes"); 
        if(response.data && response.data.notes){
          setAllNotes(response.data.notes)
        }
      }
      catch(error){
        console.log("An unexpected error has occured. Please try again.");
      }
    }




    //delete Note API integration 
const handleDelete = async(note)=>{
  const noteId = note._id ;
  try{
    const response = await axiosInstance.delete("/delete-note/" + noteId) 
    if(response.data && !response.data.error){
      GetAllNotes() 
      handleShowToastMsg("Note Deleted Successfully.", "delete")
    }
  }
  catch(error){
    if(error.response && error.response.data && error.response.data.message){
      console.log("An unexpected error occured. Please try again.")
    }
  }
}


// search for a note API Integration 
const onSearchNote = async(query) => {
  try{
    const response = await axiosInstance.get("/search-notes/",{
      params: {query},
    })
    if(response.data && response.data.notes){
      setIsSearch(true) ;
      setAllNotes(response.data.notes)
    }
  }
  catch(error){
    console.log(error)
  }
}



// note is pinned API Integration 
const updateIsPinned = async (noteData) => {
  const noteId = noteData._id;

  try {
    const updatedPinnedStatus = !noteData.isPinned;
    const response = await axiosInstance.put("/update-note-pinned/" + noteId, { isPinned: updatedPinnedStatus });

    if (response.data && response.data.note) {
      GetAllNotes(response.data);
      const message = updatedPinnedStatus ? "Note Pinned Successfully." : "Note Unpinned Successfully.";
      handleShowToastMsg(message);
    }
  } catch (error) {
    console.log(error);
  }
};


const handleClearSearch = () => {
  setIsSearch(false)
  GetAllNotes()
}

    useEffect(() => {
      GetUserInfos();
      GetAllNotes();
    }, []);

  return (
    <>
      <NavBar userInfos={userInfos} onSearchNote={onSearchNote} handleClearSearch={handleClearSearch}/>

      <div className="container mx-auto">
        <div className="grid grid-cols-3 gap-4 mt-8">
          {allNotes.map((note, index) => (
            <NoteCard key={index}
            title={note.title}
            date={moment(note.createdOn).format("Do MMM YYYY")}
            content={note.content}
            tags={note.tags}
            isPinned={note.isPinned}
            onEdit={() => {handleEdit(note)}}
            onDelete={() => {handleDelete(note)}}
            onPinNote={() => {updateIsPinned(note)}}
          />
          ))}

        </div>

        <button
          className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
          onClick={() => {
            setopenAddEditModal({ isShown: true, type: "add", data: null });
          }}
        >
          <MdAdd className="text-[32px] text-white" />
        </button>
      </div>

      <Modal
        onRequestClose={() => {}}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.2)",
          },
        }}
        isOpen={openAddEditModal.isShown}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-20 p-5 overflow-scroll"
      >
        <AddEditNote
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            onClose(
              setopenAddEditModal({
                isShown: false,
                type: "add",
                data: null,
              })
            );
          }}
          GetAllNotes={GetAllNotes}
          handleShowToastMsg={handleShowToastMsg}
        />
      </Modal>

          <Toast isShown={showToastMsg.isShown} message={showToastMsg.message} type={showToastMsg.type} onClose={handleCloseToast}/>

    </>
  );
};

export default Home;
