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
      <Row className="grey-border-bottom" style={{ padding: "3% 0%" }}>
        <Col
          xs={{ span: "8", offset: "" }}
          lg={{ span: "5", offset: "" }}
          className=""
          style={{ paddingTop: "1%", paddingLeft: "5%" }}
        >
          <Form.Group
            controlId="formBasicSearch"
            style={{ width: "95%" }}
            className=""
          >
            <div className="search-input-group">
              <Form.Control
                style={{ padding: "2.5%" }}
                required
                className="round-border input-font-size input-padding-lf input-margin-buttom"
                type="text"
                placeholder="Search by location"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button
                variant="success"
                className="round-border search-button"
                // onClick={handleSearch}
              >
                <img
                  src={Icon8}
                  alt=""
                  width="20px"
                  style={{ marginRight: "10%", marginBottom: "5%" }}
                />
                Search
              </Button>
            </div>
          </Form.Group>
        </Col>
        <Col
          xs={{ span: "2", offset: "" }}
          lg={{ span: "2", offset: "" }}
          style={{
            borderLeft: "1px solid black",
            paddingTop: "1.35%",
            paddingLeft: "2.5%",
          }}
        >
          <div style={{}}>
            <Form.Group
              controlId="exampleForm.SelectCustomSizeSm"
              style={{ position: "relative" }}
            >
              <span className="filta-img" style={{}}>
                <img src={filtericon} alt="flterIcon" width="100%" style={{}} />
              </span>
              {/* Filter by hospital tags */}
              <Form.Control
                as="select"
                // size="sm"
                className="round-border filta"
                custom
                value={hospitalTag}
                onChange={(e) => setHospitalTag(e.target.value)}
                style={{}}
              >
                <option value="" style={{}}>
                  Filters
                </option>
                {availableTags.map((tag) => (
                  <option style={{}} key={tag} value={tag}>
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
          className=""
          style={{ paddingTop: "1.35%" }}
        >
          <Button
            variant="success"
            style={{}}
            className="round-border expt-cvs-btn"
          >
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
    </div>
  );
};


const NavBar = () => {
  const [isNavFixed, setIsNavFixed] = useState(false);
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
    <Navbar
      bg=""
      expand="lg"
      className={
        isNavFixed ? "fixed-top" : "grey-border-bottom"
      }
      style={{
        padding : "1.5% 0"
      }}
    >
      <Navbar.Brand
        href="/"
        className="nav-brand-landing"
      >
        <img src={frame10} alt="" width="30%" className="nav-brand-img" />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav
          className="ml-auto nav-landing"
        >
          <Nav.Link
            href="/"
            className="find-hospital"
          >
            <img
              src={Icon2}
              alt=""
              width="20px"
              className="find-hospital-img"
            />
            Find Hospitals
          </Nav.Link>
          <Nav.Link
            href="/savedHospitals"
            className="saved-hospital"
          >
            <img
              src={Icon1}
              alt=""
              width="20px"
              className="saved-hospital-img"
            />
            Saved
          </Nav.Link>
          <Nav.Link
            href="/login"
            className="my-profile"
          >
            <img
              src={Icon3}
              alt=""
              width="22px"
              className="rounded-circle my-profile-img"
            />
            My Profile
          </Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
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
