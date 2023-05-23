import { useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import googleLogo from "../images/googleLogo.svg";
import frame1 from "../images/frame1.png";
import frame2 from "../images/frame2.png";
import frame10 from "../images/Frame10.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export function NavSignUpLogin() {
  return (
    <Row className="grey-border-bottom nav-login-container">
      <Col xs={{ span: "2", offset: '1' }} className="">
        <img src={frame10} alt="" width="60%" />
      </Col>
      <Col xs={{ span: "2", offset: '6' }} className="">
        <Button className="round-border btn-bg-inherit login-btn ">Login Instead</Button>
      </Col>
    </Row>
  );
}

function SignUp() {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <Container fluid className="signUp-conainer">{/*------we can add "fixed" to the class to make it fixed------*/}
      <NavSignUpLogin />
      <br/>
      <br/>
      <br/>
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
              <h6 style={{fontWeight: '700'}}>Create New Account</h6>
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
                <Col xs={{ span: "1" }}>or</Col>
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
                className="round-border input-font-size input-padding-lf"
                type="text"
                placeholder="E.g Eric Davidson"
              />
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                className="round-border input-font-size input-padding-lf"
                type="email"
                placeholder="E.g edavidson@gmail.com"
              />
            </Form.Group>

            <Form.Group controlId="formBasicLastName">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                className="round-border input-font-size input-padding-lf"
                type="text"
                placeholder="E.g 08098739000"
              />
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <div className="password-input-container">
                <Form.Control
                  className="round-border input-font-size input-padding-lf"
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

            <Button
              className="round-border"
              variant="success"
              type="submit"
              style={{ width: "100%", marginTop: "5%" }}
            >
              Create Account
            </Button>
            <br />
            <br />
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
}

export default SignUp;
