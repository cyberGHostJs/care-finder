import { Col, Container, Row, Form, Button } from "react-bootstrap";
import frame10 from "../images/Frame10.png";
import Icon1 from "../images/Icon1.png";
// import dropdownicon from "../images/dropdownicon.png";
import Icon2 from "../images/Icon2.png";
import Icon3 from "../images/Icon3.png";
import Icon8 from "../images/Icon8.png";
import filtericon from "../images/filtericon.png";
import { Link } from "react-router-dom";
import downloadicon from "../images/downloadicon.png";
import calendaicon from "../images/calendaicon.png";
import clock from "../images/clock.png";
import mappin from "../images/mappin.png";
import firebase from "firebase/compat/app";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../firebase";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Navbar, Nav } from "react-bootstrap";
// import React, { useState } from 'react';
// import axios from 'axios';

const HospitalsDataBase = () => {
  const [hospitalTag, setHospitalTag] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [allHospitals, setAllHospitals] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);

  useEffect(() => {
    const unsubscribe = firestore
      .collection("hospitals")
      .onSnapshot((snapshot) => {
        const fetchedHospitals = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setAllHospitals(fetchedHospitals);

        if (searchQuery.trim() === "") {
          setFilteredHospitals(fetchedHospitals);
        } else {
          handleSearch();
        }
      });

    return () => unsubscribe();
  }, [searchQuery]);

  useEffect(() => {
    const tagsSet = new Set();
    allHospitals.forEach((hospital) => {
      hospital.tag.forEach((tag) => {
        tagsSet.add(tag);
      });
    });
    const tagsArray = Array.from(tagsSet);
    setAvailableTags(tagsArray);
  }, [allHospitals]);

  const handleSearch = () => {
    const query = searchQuery.toLowerCase();
    const matchedHospitals = allHospitals.filter(
      (hospital) =>
        hospital.name.toLowerCase().includes(query) ||
        hospital.address.toLowerCase().includes(query)
    );
    setFilteredHospitals(matchedHospitals);
  };

  return (

    <div>
    <div className="App" style={{ padding: " 0 5%"}}>
      <header className="App-header text-center" style={{ marginTop: "5%"}}>
        <h1>Welcome to Care-finder</h1>
        <p className="App-subtitle">Your Ultimate Hospital Search Tool</p>
      </header>

      <Row className="App-section">
        <Col lg="6">
          <h2>Discover Hospitals Effortlessly</h2>
          <p>With Care-finder, you can easily search for hospitals within your region. Simply input your location or choose from a list of nearby cities to find hospitals in your area. Our platform provides a comprehensive list of hospitals, complete with their contact details, including address, phone number, and email. Finding the right healthcare provider has never been easier.</p>
        </Col>
        <Col lg="6">
          <h2>Export and Save Information with Ease</h2>
          <p>Care-finder understands the need to keep track of important hospital information. That's why we've made it simple for you to export the list of hospitals to a CSV file. With just a few clicks, you can save the information and have it readily available whenever you need it. We've integrated Firebase's built-in file storage for a seamless exporting experience.</p>
        </Col>
      </Row>

      <Row className="App-section">
        <Col lg="6">
          <h2>Share Hospital Information with Others</h2>
          <p>Sharing valuable hospital information is made effortless with Care-finder. Whether you want to notify a friend or colleague about a specific hospital or distribute the entire list to your team, we've got you covered. Share the information via email or generate a shareable link, making it convenient to disseminate the details to anyone you choose. Our integration with Firebase's email and link sharing functionalities ensures secure and efficient sharing.</p>
        </Col>
        <Col lg="6">
          <h2>Unlock Advanced Features as an Admin User</h2>
          <p>As an admin user, you gain access to exclusive features that enhance your Care-finder experience. To ensure the security and integrity of the platform, admin users are required to create an account using Firebase's authentication feature. Benefit from multiple authentication methods, including email/password and social media logins, for a seamless login process.</p>
        </Col>
      </Row>

      <Row className="App-section">
        <Col lg="6">
          <h2>Create Hospital Entries with Markdown</h2>
          <p>Admin users have the power to create and manage hospital entries and their corresponding details. With our user-friendly text editor, which supports markdown syntax, you can easily format your content, add links, and even insert images. Our goal is to provide a hassle-free content creation experience that empowers you to showcase hospitals accurately and effectively. <a href="https://care-finder-omega.vercel.app/adminsignup" target="_blank">AdminSignup</a></p>
        </Col>
        <Col lg="6">
          <h2>&nbsp;</h2>
          {/* Add an empty column to maintain alignment */}
        </Col>
      </Row>
    </div>


      <Row className="grey-border-bottom sec-paddin">
        <Col
          xs={{ span: "8", offset: "" }}
          lg={{ span: "5", offset: "" }}
          className="d-flex align-items-center justify-content-center"
        >
          <Form.Group controlId="formBasicSearch" className="search-container">
            <Form.Control
              required
              className="search-input"
              type="text"
              placeholder="Search by location"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button variant="success" className="round-border search-button">
              {/* <img
                  src={Icon8}
                  alt=""
                  width="20px"
                  style={{ marginRight: "10%", marginBottom: "5%" }}
                /> */}
              Search
            </Button>
          </Form.Group>
        </Col>
        <Col
          className="d-flex align-items-center justify-content-center"
          xs={{ span: "2", offset: "" }}
          lg={{ span: "2", offset: "" }}
          style={{
            borderLeft: "1px solid grey",
          }}
        >
          <div>
            <Form.Group
              controlId="exampleForm.SelectCustomSizeSm"
              style={{ position: "relative" }}
            >
              <span className="filta-img">
                <img src={filtericon} alt="flterIcon" width="100%" />
              </span>
              {/* Filter by hospital tags */}
              <Form.Control
                as="select"
                // size="sm"
                className="round-border filta"
                custom
                value={hospitalTag}
                onChange={(e) => setHospitalTag(e.target.value)}
              >
                <option value="">Filters</option>
                {availableTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
          </div>
        </Col>

        <Col
          xs={{ span: "2", offset: "" }}
          lg={{ span: "3", offset: "2" }}
          className="d-flex align-items-center justify-content-center"
        >
          <Button variant="success" className="round-border expt-cvs-btn">
            <img src={downloadicon} alt="" width="20px" className="cvs-img" />
            <span className="expt-cvs">Export list as CVS</span>
          </Button>
        </Col>
      </Row>
      {/* Display hospitals */}
      {filteredHospitals.length === 0 ? (
        <p>No hospitals found.</p>
      ) : (
        <Row
          style={{
            marginBottom: "20px",
            width: "95%",
            margin: "5% auto",
            marginLeft: "4%",
          }}
        >
          {filteredHospitals.map(
            (hospital) =>
              // Render hospitals based on the selected tag (if any)
              (hospitalTag === "" || hospital.tag.includes(hospitalTag)) && (
                <Col
                  lg="3"
                  key={hospital.id}
                  className=""
                  style={{ fontSize: "14px", marginBottom: "5%" }}
                >
                  <ReactMarkdown
                    // key={index}
                    remarkPlugins={[remarkGfm]}
                    components={{
                      img: ({ src, alt }) => (
                        <img
                          src={src}
                          alt={alt}
                          style={{
                            width: "90%",
                            height: "250px",
                            borderRadius: "15px",
                          }}
                        />
                      ),
                    }}
                  >
                    {hospital.image}
                  </ReactMarkdown>
                  <h3 style={{ fontSize: "16px", fontWeight: "700" }}>
                    {hospital.name}
                  </h3>
                  <p>
                    <img
                      src={mappin}
                      alt=""
                      width="5%"
                      style={{ marginRight: "1%" }}
                    />{" "}
                    {hospital.address}
                  </p>
                  <p>
                    <img
                      src={calendaicon}
                      alt=""
                      width="5%"
                      style={{ marginRight: "1%" }}
                    />{" "}
                    {hospital.days}
                    <span style={{ marginLeft: "4%" }}>
                      <img
                        src={clock}
                        alt=""
                        width="5%"
                        style={{ marginRight: "2%" }}
                      />
                      {hospital.time}
                    </span>
                  </p>
                  <p>{hospital.email}</p>
                  <p>{hospital.phone}</p>
                </Col>
              )
          )}
        </Row>
      )}
      <footer className="App-footer text-center">
        <p>&copy; 2023 Care-finder. All rights reserved.</p>
      </footer>
    </div>
  );
};

const NavBar = () => {
  const [activeMenuItem, setActiveMenuItem] = useState("findHospitals");
  const [isNavFixed, setIsNavFixed] = useState(false);
  const [nav, setNav] = useState(false);
  const [menuButtonColor, setMenuButtonColor] = useState('none');


  const HandleNav = () => {
    setMenuButtonColor(nav ? 'none' : 'white'); // Toggle between black and white
    setNav(!nav);
    if (!nav) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "scroll";
    }
  };
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsNavFixed(true);
      } else {
        setIsNavFixed(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    //clean up event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);
  return (
    <Row>
      <Navbar
        bg=""
        expand="lg"
        className={isNavFixed ? "fixed-top" : "grey-border-bottom"}
        style={{
          padding: "1.5% 0",
        }}
      >
        <Navbar.Brand href="/" className="nav-brand-landing">
          <img src={frame10} alt="" width="30%" className="nav-brand-img" />
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="nav-menu"
          style={{ background: menuButtonColor}}
          onClick={HandleNav}
        />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav
            className={
              nav
                ? "ml-auto nav-landing nav-landing2"
                : "ml-auto nav-landing nav-landing3"
            }
          >
            <Link
              to="/"
              className={
                activeMenuItem === "findHospitals"
                  ? "nav-color-active find-hospital"
                  : "find-hospital nav-color"
              }
            >
              <img
                src={Icon2}
                alt=""
                width="20px"
                className="find-hospital-img"
              />
              Find Hospitals
            </Link>
            <Link
            onClick={() => {
              if (activeMenuItem === "savedHospitals") {
              } else {
                document.body.style.overflow = "scroll";
              }
            }}
              to="/savedHospitals"
              className={
                activeMenuItem === "saved"
                  ? "nav-color-active saved-hospital"
                  : "saved-hospital nav-color"
              }
            >
              <img
                src={Icon1}
                alt=""
                width="20px"
                className="saved-hospital-img"
              />
              Saved
            </Link>
            <Link
            onClick={() => {
              if (activeMenuItem === "savedHospitals") {
              } else {
                document.body.style.overflow = "scroll";
              }
            }}
              to="/welcome"
              className={
                activeMenuItem === "profile"
                  ? "nav-color-active my-profile"
                  : "my-profile nav-color"
              }
            >
              <img
                src={Icon3}
                alt=""
                width="22px"
                className="rounded-circle my-profile-img"
              />
              My Profile
            </Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </Row>
  );
};

function Landing() {
  return (
    <Container fluid style={{}}>
      <NavBar />
      <HospitalsDataBase />
    </Container>
  );
}

export default Landing;
