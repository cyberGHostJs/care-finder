import { NavSignUpLogin } from "./SignUp";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import googleLogo from "../images/googleLogo.svg";
import frame1 from "../images/frame1.png";
import frame2 from "../images/frame2.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../firebase";
import firebase from "firebase/compat/app";

const LoginIn = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  //login with email and password
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Sign in the user with email and password
      await auth.signInWithEmailAndPassword(email, password);

      // Clear login form inputs
      setEmail("");
      setPassword("");

      // Redirect to the appropriate welcome page based on user role
      const userSnapshot = await firestore
        .collection("users")
        .where("email", "==", email)
        .get();
      const isAdmin = await firestore
        .collection("admins")
        .where("email", "==", email)
        .get();

      if (isAdmin) {
        navigate("/adminWelcomePage");
      } else {
        navigate("/welcome");
      }
    } catch (error) {
      console.error("Login error:", error);
      // Handle login error and display an error message
    }
  };

  const handleLoginWithGmail = async (e) => {
    e.preventDefault();

    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });

      const { user } = await auth.signInWithPopup(provider);

      // Check if the user's email exists in Firestore
      const userSnapshot = await firestore
        .collection("users")
        .where("email", "==", user.email)
        .get();
      const adminSnapshot = await firestore
        .collection("admins")
        .where("email", "==", user.email)
        .get();

      if (userSnapshot.empty && adminSnapshot.empty) {
        // User email does not exist in either users or admins collection
        navigate("/signUp");
        throw new Error("User email does not exist.");
      } else if (!userSnapshot.empty) {
        // User email exists in the users collection
        navigate("/welcome");
      } else if (!adminSnapshot.empty) {
        // User email exists in the admins collection
        navigate("/adminWelcomePage");
      }
    } catch (error) {
      console.error("Login with Gmail error:", error);
      // Handle login error with Gmail and display an error message
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <Container fluid className="signUp-conainer">
      <NavSignUpLogin
        buttonText="Create Account"
        buttonBgColor="#167150"
        buttonBorder="1px solid #167150"
        btnColor="white"
        linkTo="/signup"
        btnMarginLft="5%"
      />
      <br />
      <br />
      <br />
      <br />
      <Row style={{ height: "95vh" }}>
        {/* -------buttom image left--------------------- */}
        <Col className="relative">
          <img
            src={frame2}
            alt="buttomLeftImg"
            width="60%"
            className="absolute left bottom"
          />
        </Col>

        {/* -------Sign Up--------------------- */}
        <Col lg={{ span: "4" }}>
          {/*-----first section----------*/}
          <Row>
            <Col>
              <h6 style={{ fontWeight: "700" }}>Login To Your Account</h6>
              <p className="text-muted">
                Login in with google or enter login detail to access your
                account
              </p>
              <Form>
                <Button
                  onClick={handleLoginWithGmail}
                  className="round-border no-border input-font-size"
                  type="submit"
                  style={{
                    width: "100%",
                    color: "black",
                    backgroundColor: "white",
                  }}
                >
                  <img src={googleLogo} alt="googleLogo" width="6%" /> Login
                  with Google
                </Button>
              </Form>
              <br />
              <br />
              <Row>
                <Col>
                  <hr />
                </Col>
                <Col xs={{ span: "1" }}>Or</Col>
                <Col>
                  <hr />
                </Col>
              </Row>
            </Col>
          </Row>
          {/*---------Sign Up form---------*/}
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="round-border input-font-size input-padding-lf input-margin-buttom"
                type="email"
                placeholder="E.g edavidson@gmail.com"
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <div className="password-input-container">
                <Form.Control
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ marginBottom: "2%" }}
                  className="round-border input-font-size input-padding-lf "
                  type={passwordVisible ? "text" : "password"}
                  placeholder="Enter password"
                />
                <div className="password-icon-container">
                  <FontAwesomeIcon
                    icon={passwordVisible ? faEyeSlash : faEye}
                    className="password-icon"
                    onClick={togglePasswordVisibility}
                  />
                </div>
              </div>
            </Form.Group>
            <Form.Text
              style={{ width: "100%", color: "black", fontWeight: "500" }}
            >
              Forgot Password?{" "}
              <Link to="/resetpassword" style={{ marginLeft: "" }}>
                <span
                  style={{
                    color: "#2F80ED",
                  }}
                >
                  <> Reset your password</>
                </span>
              </Link>
            </Form.Text>
            <br />
            <br />

            <Button
              className="round-border"
              variant="success"
              type="submit"
              style={{ width: "100%", marginTop: "5%" }}
              onClick={handleLogin}
            >
              Login
            </Button>
            <br />
            {/* <br /> */}
            <Button className="link-btn no-border btn-bg-inherit">
              It's an emergency, connect me quickly
            </Button>
            <br />
          </Form>
        </Col>

        {/* -------buttom image right--------------------- */}
        <Col className="relative">
          <img
            src={frame1}
            alt="buttomRightImg"
            width="60%"
            className="absolute right bottom"
          />
        </Col>
      </Row>
    </Container>
  );
};

export default LoginIn;

//----BUILD UP____------
// //====START=====
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { auth } from "../firebase";
// // import firebase from "firebase/compat/app";

// function LoginPage() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();

//     try {
//       // Sign in the user with email and password
//       await auth.signInWithEmailAndPassword(email, password);

//       // Clear login form inputs
//       setEmail("");
//       setPassword("");

//       // Redirect to the welcome page
//       navigate("/welcome");
//     } catch (error) {
//       console.error("Login error:", error);
//       // Handle login error and display an error message
//     }
//   };

//   return (
//     <form>
//       <input
//         type="email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//         placeholder="Email"
//       />
//       <input
//         type="password"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         placeholder="Password"
//       />
//       <button type="submit" onClick={handleLogin}>
//         Login
//       </button>
//     </form>
//   );
// }

// export default LoginPage;
