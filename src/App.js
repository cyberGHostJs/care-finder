import './styles/signUp.css';
import SignUp from "./components/SignUp";
import LoginIn from "./components/Login";
import {
  Routes, // instead of "Switch"
  Route,
  useNavigate,
} from "react-router-dom";
import Landing from './components/Landing';

function App() {
  const nav = useNavigate();
  const handleCheckout = () => nav("/");
  return (
    <Routes history={handleCheckout}>
    <Route path="/" element={<Landing />} />
    <Route path="/signup" element={<SignUp />} />
    <Route path="/login" element={<LoginIn />} />
    {/* <Route path="*" element={<PageNotFound />} />  */}
  </Routes>
  ); 
}

export default App;
