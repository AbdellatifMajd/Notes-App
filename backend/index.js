require("dotenv").config();
const mongoose = require("mongoose");
const config = require("./config.json");

mongoose
  .connect(config.connectionString)
  .then(() => {
    console.log("connected to database");
  })
  .catch(() => {
    console.log("connection failed");
  });

const express = require("express");
const app = express();
const cors = require("cors");

const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities.js");

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

// -------------------------------------------------------------------------------------------------------------------------------------------




const User = require("./models/user.model");
const Note = require("./models/note.model");

//create-account API
// -------------------------------------------------------------------------------------------------------------------------------------------

app.post("/create-account", async (req, res) => {
  const { fullName, email, password } = req.body;

  if (!fullName) {
    return res
      .status(400)
      .json({ error: true, message: "Full Name is required" });
  }

  if (!email) {
    return res.status(400).json({ error: true, message: "Email is required" });
  }

  if (!password) {
    return res
      .status(400)
      .json({ error: true, message: "Password is required" });
  }

  const isUser = await User.findOne({ email: email });
  if (isUser) {
    return res
      .status(401)
      .json({ error: true, message: "User already exists" });
  }

  const user = new User({ fullName, email, password });
  await user.save();

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "36000m",
  });

  return res.json({
    error: false,
    user,
    accessToken,
    message: "Registration Successful",
  });
});

// -------------------------------------------------------------------------------------------------------------------------------------------
//Login API
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: true, message: "Email required" });
  }

  if (!password) {
    return res.status(400).json({ error: true, message: "Password required" });
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    return res.status(404).json({ error: true, message: "User not found" });
  }

  const accessToken = jwt.sign({ user }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: "36000",
  });
  if (user.email == email && user.password == password) {
    return res.status(201).json({
      error: false,
      user,
      accessToken,
      message: "Login successful",
    });
  } else {
    return res
      .status(400)
      .json({ error: true, message: "Invalid Credentials" });
  }
});


// -------------------------------------------------------------------------------------------------------------------------------------------
//Get user API 
app.get("/get-user", authenticateToken, async (req, res)=>{
  const {user} = req.user ; 
  const isUser = await User.findOne({_id: user._id}); 

  if(!isUser){
    return res.status(401)
  }

  return res.json({
    user: {
      fullName: isUser.fullName,
      email: isUser.email, 
      _id: isUser._id, 
      createdOn: isUser.createdOn
    }, 
    message: " User retrieved successfully"
  })
})


// -------------------------------------------------------------------------------------------------------------------------------------------
//Add Note API
app.post("/add-note",authenticateToken, async (req, res) => {

  const {title, content, tags} = req.body ;
  const {user} = req.user;

  if(!content){
    return res.status(400).json({
      error: true, 
      message: "content is required"
    })
  }

  if (!title){
    return res.status(400).json({
      error: true, 
      message: "title is required"
    })
  }


try{
  const note = new Note({
    title: title, 
    content: content, 
    tags: tags || [], 
    userId: user._id
  })
  await note.save();

  return res.json({
    error: false, 
    message: "Note added successfully",
    note, 
  })


}
catch(error){
  return res.status(500).json({
    error:true, 
    message: "internal server error"
  })

}
  

})


// -------------------------------------------------------------------------------------------------------------------------------------------
//Edit Note API
app.put("/edit-note/:noteId", authenticateToken, async(req, res) => {
  const noteId = req.params.noteId ;
  const {user} = req.user ; 
  const {title, content, tags, isPinned} = req.body ; 
  if(!title && !content & !tags){
    return res.status(400).json({error: true, message: "No change provided"});
  }

  try{
    const note = await Note.findOne({_id: noteId, userId: user._id}) ;

    if(!note){
      return res.status(400).json({error: true, message: "Note not found"})
    }
    if(title) note.title = title ; 
    if(content) note.content = content ; 
    if (tags) note.tags = tags ; 
    if(isPinned) note.isPinned = isPinned ; 

    await note.save() ;

    return res.status(201).json({
      error: false, 
      message: "Note updated successfully", 
      note 
    })
  }
  catch(error){
    return res.status(500).json({error: true, message: "Internal server error"});
  }


})


// -------------------------------------------------------------------------------------------------------------------------------------------
//get-all-notes API  
app.get("/get-all-notes", authenticateToken, async(req, res)=>{
  const {user} = req.user ;
  try{
    const notes = await Note.find({userId: user._id}).sort({isPinned: -1})
  return res.status(201).json({error: false, notes, message: "All notes retrieved successfully"})

  }
  catch(error){
    return res.status(500).json({error: true, message: "Internal server error"});
  }
})


// -------------------------------------------------------------------------------------------------------------------------------------------
//delete Note API 
app.delete("/delete-note/:noteId", authenticateToken, async(req, res)=>{
  const{user} = req.user ; 
  const noteId = req.params.noteId ; 

  try{
    const note = await Note.findOne({_id: noteId, userId: user._id});
    if(!note){
      return res.status(404).json({
        error: true, 
        message: "Note not found"
      })
    }
    await note.deleteOne({_id: noteId, userId: user._id});

    return res.status(201).json({
      error: false, 
      message: "Note deleted successfully", 
      note
    })
  }
  catch(error){
    return res.status(500).json({
      error: true, 
      message: "Internal server error" 
    })
  }
})  


// -------------------------------------------------------------------------------------------------------------------------------------------
//update note pinned API 
app.put("/update-note-pinned/:noteId", authenticateToken, async(req, res)=>{
  const {user} = req.user  ; 
  const noteId = req.params.noteId ;
  const {isPinned} = req.body; 
  try{
    const note = await Note.findOne({_id: noteId, userId: user._id})

    if(!note){
      return res.status(404).json({error: true, message: "Note not found"});
    }

    if(isPinned) note.isPinned = isPinned || false; 
    await note.save(); 

    return res.status(200).json({error: false, message: "Note is pinned successfully", note})
  }
  catch(error){
    return res.status(500).json({error: true, message: "Internal error server"});
  }
})  

// -------------------------------------------------------------------------------------------------------------------------------------------




app.get("/", (req, res) => {
  res.send("Hello world from localhost 8000");
});

app.listen(8000, () => {
  console.log("server is running on port 8000");
});

module.exports = app;
