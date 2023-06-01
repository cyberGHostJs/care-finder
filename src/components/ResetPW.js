import { NavSignUpLogin } from "./SignUp";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import frame1 from "../images/frame1.png";
import frame2 from "../images/frame2.png";
import { Link } from "react-router-dom";



function ResetPW() {
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
              <h6 style={{ fontWeight: "700" }}>Reset Your Password</h6>
              <p className="text-muted">
              Enter your email address to reset your password.
              </p>
              {/* <br /> */}
              {/* <br /> */}
            </Col>
          </Row>
          {/*---------Sign Up form---------*/}
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                required
                className="round-border input-font-size input-padding-lf input-margin-buttom"
                type="email"
                placeholder="E.g edavidson@gmail.com"
              />
            </Form.Group>

            <Button
              className="round-border"
              variant="success"
              type="submit"
              style={{ width: "100%", marginTop: "5%" }}
            >
              Send Reset Link
            </Button>
            <br />
            <Link to="/login">
            <Button className="link-btn blue-cl no-border btn-bg-inherit">
            Login Instead
            </Button>
            </Link>
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
export default ResetPW;
