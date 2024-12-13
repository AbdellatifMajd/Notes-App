import React, {useState} from "react";
import NavBar from "../../components/NavBar/NavBar";
import { Link, useNavigate } from "react-router-dom";
import PasswordInput from "../../components/Inputs/PasswordInput";
import { validateEmail } from "../../utils/helper";
import axiosInstance from "../../utils/axiosinstance";


const Login = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if(email === ""){
      setError("please enter your email adress")
      return
    }
    if(!validateEmail(email)){
      setError("please enter a valid email adress");
      return 
    }
    if(password === ""){
      setError("please enter your password")
      return
    }

    

    setError("");


      // Login API CALL    (HNA FIN KAYTRA DAK L'COMMUNICATION BETWEEN THE CLIENT AND THE SERVER  SOUS FORME REQUEST AND RESPONSE)
    try{
        const response = await axiosInstance.post("/login", {
          email: email, 
          password: password
        }) 
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


<div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
<h2 className="text-xl font-medium text-black py-2">Notes</h2></div>



      <div className="flex items-center justify-center mt-28">
        <div className="w-96 border rounded bg-white px-7 py-10">
          <form action="" onSubmit={handleLogin}>
            <h4 className="text-2xl mb-7">Login</h4>
            <input type="text" placeholder="Email" className="input-box" value={email} onChange={(e) =>setEmail(e.target.value)}/>
            <PasswordInput value={password} onChange={(e) => setPassword(e.target.value)} />
              <span className="text-red-300 text-xs pb-1">{error}</span>

            <button type="submit" className="btn-primary">
              Login
            </button>

            <p className="text-sm text-center mt-4">
              Not register yet? {""}
              <Link
                to={"/create-account"}
                className="font-medium text-primary underline"
              >
                Create an Account
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
