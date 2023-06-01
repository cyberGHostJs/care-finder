import { Button, Col, Container, Form, Row } from "react-bootstrap";
import googleLogo from "../images/googleLogo.svg";
import frame1 from "../images/frame1.png";
import frame2 from "../images/frame2.png";
import frame10 from "../images/Frame10.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import IconAlert from "../images/IconAler.png";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../firebase";

export function NavSignUpLogin({
  buttonText,
  buttonBgColor,
  buttonBorder,
  btnColor,
  linkTo,
  btnMarginLft,
}) {
  return (
    <Row className="grey-border-bottom nav-login-container">
      <Col xs={{ span: "2", offset: "1" }} className="">
        <Link to="/">
          <img src={frame10} alt="" width="60%" />
        </Link>
      </Col>
      <Col xs={{ span: "2", offset: "6" }} className="">
        <Link to={linkTo} style={{ marginLeft: btnMarginLft }}>
          <Button
            className="round-border login-btn "
            style={{
              backgroundColor: buttonBgColor,
              border: buttonBorder,
              color: btnColor,
            }}
          >
            {buttonText}
          </Button>
        </Link>
      </Col>
    </Row>
  );
}

function SignUp() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordValidated, setPasswordValidated] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      // Create user with email and password
      const { user } = await auth.createUserWithEmailAndPassword(
        email,
        password
      );

      // Save additional user data to Firestore
      await firestore.collection("users").doc(user.uid).set({
        email: user.email,
        fullName,
        phoneNumber,
      });

      // Clear sign-up form inputs
      setEmail("");
      setPassword("");
      setFullName("");
      setPhoneNumber("");

      // Redirect to the welcome page
      navigate("/welcome");
    } catch (error) {
      console.error("Sign up error:", error);
      // Handle sign-up error and display an error message
    }
  };

  //toggle visibility
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  //password validate
  const validatePassword = (value) => {
    return value.length >= 8;
  };

  const handlePasswordBlur = () => {
    setPasswordValidated(true);
  };

  const isPasswordValid = validatePassword(password);

  return (
    <Container fluid className="signUp-conainer">
      {/*------we can add "fixed" to the class to make it fixed------*/}
      <NavSignUpLogin
        buttonText="Login Instead"
        buttonBgColor="inherit"
        buttonBorder="1px solid #031538"
        btnColor="#031538"
        linkTo="/login"
        btnMarginLft="12%"
      />
      <br />
      <br />
      <br />
      <Row>
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
              <h6 style={{ fontWeight: "700" }}>Create New Account</h6>
              <p className="text-muted">
                Choose one of the method to create an account.
              </p>
              <Form>
                <Button
                  className="round-border no-border input-font-size"
                  type="button"
                  style={{
                    width: "100%",
                    color: "black",
                    backgroundColor: "white",
                  }}
                  // onClick={signUpWithGoogle} // Add this onClick event handler
                >
                  <img src={googleLogo} alt="googleLogo" width="6%" /> Sign Up
                  with Google
                </Button>
              </Form>
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
              {/* <br /> */}
            </Col>
          </Row>
          {/*---------Sign Up form---------*/}
          <Form>
            <Form.Group controlId="formBasicFirstName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                required
                onChange={(e) => setFullName(e.target.value)}
                value={fullName}
                className="round-border input-font-size input-padding-lf input-margin-buttom"
                type="text"
                placeholder="E.g Eric Davidson"
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                required
                className="round-border input-font-size input-padding-lf input-margin-buttom"
                type="email"
                placeholder="E.g edavidson@gmail.com"
              />
            </Form.Group>

            <Form.Group controlId="formBasicLastName">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                required
                className="round-border input-font-size input-padding-lf input-margin-buttom"
                // type="number"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="E.g 08098739000"
                maxLength={11}
                minLength={11}
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <div className="password-input-container">
                <Form.Control
                  required
                  className={`round-border input-font-size input-padding-lf ${
                    passwordValidated && !isPasswordValid ? "" : ""
                  }`}
                  minLength={8}
                  type={passwordVisible ? "text" : "password"}
                  placeholder={passwordVisible ? "E.g Gamer68$" : "********"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  // onChange={handlePasswordChange}
                  onBlur={handlePasswordBlur}
                />
                <div className="password-icon-container">
                  <FontAwesomeIcon
                    icon={passwordVisible ? faEyeSlash : faEye}
                    className="password-icon"
                    onClick={togglePasswordVisibility}
                  />
                </div>
              </div>
              {!isPasswordValid && (
                <Form.Text className="text-danger ">
                  <img src={IconAlert} alt="alert" width="5%" />{" "}
                  <span style={{ marginLeft: "2%" }}>
                    {" "}
                    Password should be atleast 8 characters long
                  </span>
                </Form.Text>
              )}
            </Form.Group>

            <Button
              // disabled={!isPasswordValid}
              className="round-border"
              variant="success"
              type="submit"
              style={{ width: "100%", marginTop: "5%" }}
              onClick={handleSignUp}
            >
              Create Account
            </Button>

            <br />
            <Button className="link-btn red-cl no-border btn-bg-inherit">
              It's an emergency, connect me quickly
            </Button>
            <br />
            <br />
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
}

export default SignUp;

//====building-block=====//
// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { auth, firestore } from "../firebase";
// import firebase from "firebase/compat/app";

// function SignUp() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [fullName, setFullName] = useState("");
//   const [phoneNumber, setPhoneNumber] = useState("");
//   const navigate = useNavigate();

//   const handleSignUp = async (e) => {
//     e.preventDefault();

//     try {
//       // Create user with email and password
//       const { user } = await auth.createUserWithEmailAndPassword(email, password);

//       // Save additional user data to Firestore
//       await firestore.collection("users").doc(user.uid).set({
//         email: user.email,
//         fullName,
//         phoneNumber,
//       });

//       // Clear sign-up form inputs
//       setEmail("");
//       setPassword("");
//       setFullName("");
//       setPhoneNumber("");

//       // Redirect to the welcome page
//       navigate("/welcome");
//     } catch (error) {
//       console.error("Sign up error:", error);
//       // Handle sign-up error and display an error message
//     }
//   };

//   const handleSignUpWithGmail = async () => {
//     try {
//       // Create a Google provider instance
//       const provider = new firebase.auth.GoogleAuthProvider();

//       // Sign in with Google popup
//       const { user } = await auth.signInWithPopup(provider);

//       // Save additional user data to Firestore
//       await firestore.collection("users").doc(user.uid).set({
//         email: user.email,
//         fullName: user.displayName,
//         phoneNumber: user.phoneNumber,
//       });

//       // Redirect to the welcome page
//       navigate("/welcome");
//     } catch (error) {
//       console.error("Sign up with Gmail error:", error);
//       // Handle sign-up error with Gmail and display an error message
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
//       <input
//         type="text"
//         value={fullName}
//         onChange={(e) => setFullName(e.target.value)}
//         placeholder="Full Name"
//       />
//       <input
//         type="text"
//         value={phoneNumber}
//         onChange={(e) => setPhoneNumber(e.target.value)}
//         placeholder="Phone Number"
//       />
//       <button type="submit" onClick={handleSignUp}>
//         Sign Up
//       </button>
//       <button onClick={handleSignUpWithGmail}>Sign Up with Gmail</button>
//     </form>
//   );
// }

// export default SignUp;
