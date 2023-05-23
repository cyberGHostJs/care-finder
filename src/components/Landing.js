import { Container } from "react-bootstrap";
import { NavSignUpLogin } from "./SignUp";



function Landing() {
    return(
      <Container fluid style={{border:'1px solid black'}}>
        <NavSignUpLogin/>
        <p>p</p>
      </Container>
    )
  }
  
  export default Landing;
  