import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import googleLogo from "../images/googleLogo.svg";
import frame1 from "../images/frame1.png";
import frame2 from "../images/frame2.png";
import frame10 from "../images/Frame10.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

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
        <img src={frame10} alt="" width="60%" />
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
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordValidated, setPasswordValidated] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const validatePassword = (value) => {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()])[A-Za-z\d!@#$%^&*()]{5,}$/;
    return passwordRegex.test(value);
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    setPasswordValidated(false);
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
                Sign up with google or enter your personal detail below to
                create your account
              </p>
              <Form>
                <Button
                  className="round-border no-border input-font-size"
                  type="submit"
                  style={{
                    width: "100%",
                    color: "black",
                    backgroundColor: "white",
                  }}
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
                className="round-border input-font-size input-padding-lf"
                type="text"
                placeholder="E.g Eric Davidson"
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                required
                className="round-border input-font-size input-padding-lf"
                type="email"
                placeholder="E.g edavidson@gmail.com"
              />
            </Form.Group>

            <Form.Group controlId="formBasicLastName">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                required
                className="round-border input-font-size input-padding-lf"
                type="text"
                placeholder="E.g 08098739000"
              />
            </Form.Group>
            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <div className="password-input-container">
                <Form.Control
                  required
                  className={`round-border input-font-size input-padding-lf ${
                    passwordValidated && !isPasswordValid ? "is-invalid" : ""
                  }`}
                  type={passwordVisible ? "text" : "password"}
                  placeholder={passwordVisible ? "E.g Gamer68$" : "********"}
                  value={password}
                  onChange={handlePasswordChange}
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
              {passwordValidated && !isPasswordValid && (
                <Form.Text className="text-danger">
                  Password must contain at least one uppercase letter, one
                  lowercase letter, one number, one symbol, and have a minimum
                  length of 5 characters.
                </Form.Text>
              )}
            </Form.Group>

            <Button
              className="round-border"
              variant="success"
              type="submit"
              style={{ width: "100%", marginTop: "5%" }}
            >
              Create Account
            </Button>
            <br />
            <Button className="link-btn no-border btn-bg-inherit">
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
