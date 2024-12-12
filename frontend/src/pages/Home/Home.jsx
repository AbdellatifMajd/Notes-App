import React, { useState, useEffect } from "react";
import NavBar from "../../components/NavBar/NavBar";
import NoteCard from "../../components/Cards/NoteCard";
import { MdAdd } from "react-icons/md";
import moment from "moment" ;
import AddEditNote from "./AddEditNote";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosinstance";
const Home = () => {
  const [openAddEditModal, setopenAddEditModal] = useState({
    isShown: false,
    type: "add",
    data: null,
  });
  const onClose = () => {};


  const [userInfos, setUserInfos] = useState([]); 
  const [allNotes, setAllNotes] = useState([]);
  const navigate = useNavigate() 

  const handleEdit = (noteDetails) => {
    setopenAddEditModal({isShown: true, data: noteDetails, type: "edit"})
  }

  // get user infos 
  //Home.jsx : 
  const GetUserInfos = async()=>{
    
    try{
      const response = await axiosInstance.get("/get-user") 
      if(response.data && response.data.user){
        setUserInfos(response.data.user)
      }
    }
    catch(error){
      if(error.response.status === 401){
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



    useEffect(() => {
      GetUserInfos();
      GetAllNotes();
    }, []);

  return (
    <>
      <NavBar userInfos={userInfos} />

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
            onDelete={() => {}}
            onPinNote={() => {}}
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
        />
      </Modal>
    </>
  );
};

export default Home;
