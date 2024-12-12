import React ,{useState} from "react";
import NavBar from "../../components/NavBar/NavBar";
import PasswordInput from "../../components/Inputs/PasswordInput";
import { validateEmail } from "../../utils/helper";
import {Link, useNavigate} from 'react-router-dom'
import axiosInstance from "../../utils/axiosinstance";

const SignUp =  () => {
  const[name, setName] = useState("");
  const[email, setEmail] = useState("");
  const[password, setPassword] = useState("");

  const [error, setError] = useState(false);
  const navigate = useNavigate()


  const handleSignUp = async (e) => {
    e.preventDefault()
    if(name === ""){
      setError("please enter your name!");
      return 
    }
    if(email === ""){
      setError("please enter your email adress!");
      return 
    }
    if(!validateEmail(email)){
      setError("please enter a valid email adress")
      return 
    }
    if(password === ""){
      setError("please enter your password!");
      return 
    }
    setError("");


          // SignUp API Call 
          // Richard Szeliski
          try{
            const response = await axiosInstance.post("/create-account", {
              fullName: name,
              email: email, 
              password: password
            }) 
            if(response.data && response.data.error){
              setError(response.data.message)
              return 
            }
            if(response.data && response.data.accessToken){
              localStorage.setItem("token", response.data.accessToken);
              navigate("/");
            }
        }
        catch(error){
          if(error.response && error.response.data && error.response.data.message){
            setError(error.response.data.message)
          }
    
          else{
            setError("An unexpected error occured. Please try again.")
          }
        }

  }



  return (
  <div>
  <NavBar />

  <div className="flex items-center justify-center mt-28">
    <div className="w-96 border rounded bg-white px-7 py-10">
      <form action="" onSubmit={handleSignUp}>
        <h4 className="text-2xl mb-7">Sign Up </h4>
        <input type="text" placeholder="Name" className="input-box" onChange={(e) => setName(e.target.value)}/>
        <input type="text" placeholder="Email" className="input-box" onChange={(e) => setEmail(e.target.value)}/>
        <PasswordInput onChange={(e) => setPassword(e.target.value)}/>
          <span className="text-red-500 text-sx pb-1">{error}</span>

          <button type="submit" className="btn-primary">Create Account</button>
          <p className="text-sm text-center mt-4">Already have account? {" "}
            <Link to={"/login"} className="font-medium text-primary underline" >Login</Link>
            
          </p>
        
      </form>
    </div>
  </div>
</div>)
};

export default SignUp;
