import {Routes, Route} from 'react-router-dom'
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import SignUp from "./pages/SignUp/SignUp";

function App() {
  return (
    <div className="App">
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/create-account" element={<SignUp />}/>
        </Routes>
    </div>
  );
}

export default App;
