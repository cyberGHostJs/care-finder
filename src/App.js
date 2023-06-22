import "./styles/signUp.css";
import "./styles/Landing.css";
import "./styles/nav.css";
import SignUp from "./components/SignUp";
import AdminSignup from "./components/adminSignup";
import LoginIn from "./components/Login";
import Landing from "./components/Landing";
import ResetPW from "./components/ResetPW";
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./components/welcome";
import AdminWelcomePage from "./components/adminWelcome";
import SavedHospitals from "./components/SavedHospitals";



function App() {
  const isAuthenticated = true; // Replace with your authentication logic

  if (!isAuthenticated) {
    return <Navigate to="/signup" />;
  }
  return (
    <Routes>
      <Route path="/" element={<Landing />} />

      {/* ----FUNCTIONAL----- */}
      <Route path="/signup" element={<SignUp />} />
      <Route path="/AdminSignup" element={<AdminSignup />} />
      <Route path="/login" element={<LoginIn />} />
      <Route path="/welcome" element={<Welcome />} />
      <Route path="/adminWelcomePage" element={<AdminWelcomePage />} />
      <Route path="/savedHospitals" element={<SavedHospitals />} />
      <Route path="/resetpassword" element={<ResetPW />} />
      {/* <Route path="*" element={<PageNotFound />} />  */}
    </Routes>
  );
}

export default App;

//---start here

// import React from "react";
// import { Routes, Route, Navigate } from "react-router-dom";
// import Login from "./components/Login";
// import SignUp from "./components/SignUp";
// import Welcome from "./components/welcome";

// function App() {
//   const isAuthenticated = true; // Replace with your authentication logic

//   if (!isAuthenticated) {
//     return <Navigate to="/signup" />;
//   }

//   return (
//     <Routes>
//       <Route path="/signup" element={<SignUp />} />
//       <Route path="/welcome" element={<Welcome />} />
//       <Route path="/login" element={<Login />} />
//     </Routes>
//   );
// }

// export default App;
