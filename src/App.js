import "./styles/signUp.css";
import "./styles/Landing.css";
import SignUp from "./components/SignUp";
import LoginIn from "./components/Login";
import Landing from "./components/Landing";
import ResetPW from "./components/ResetPW";

import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Welcome from "./components/welcome";
// import Dashboard from './components/Dashboard';

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
      <Route path="/login" element={<LoginIn />} />
      <Route path="/welcome" element={<Welcome />} />
      {/* ----FUNCTIONAL----- */}

      <Route path="/resetpassword" element={<ResetPW />} />

      {/* <Route path="/Dashboard" element={<Dashboard />} /> */}
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
