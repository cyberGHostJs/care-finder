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
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Sign out the user
      await auth.signOut();

      // Clear the Google sign-in session
      await firebase.auth().signOut();

      // Redirect to the login page
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      // Handle logout error and display an error message
    }
  };

  return (
    <div>
      <Row className="grey-border-bottom">
        <Col
          lg={{ span: "7", offset: "" }}
          className=""
          style={{ display: "flex", padding: "1%" }}
        >
          <Form.Group
            controlId="formBasicSearch"
            style={{ marginTop: "1%", marginLeft: "9%", width: "60%" }}
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
          <div
            style={{
              borderLeft: "1px solid grey",
              paddingLeft: "4%",
              marginLeft: "4%",
              width: "40%",
            }}
          >
            <Form.Group
              controlId="exampleForm.SelectCustomSizeSm"
              style={{ marginTop: "0%", width: "50%" }}
            >
              <div style={{ position: "relative" }}>
                <span
                  style={{
                    position: "absolute",
                    width: "10%",
                    left: "7%",
                    top: "13%",
                  }}
                >
                  <img
                    src={filtericon}
                    alt="flterIcon"
                    width="100%"
                    style={{ right: "50%" }}
                  />
                </span>
                {/* Filter by hospital tags */}
                <Form.Control
                  as="select"
                  size="sm"
                  className="round-border input-font-size input-padding-lf input-margin-buttom"
                  custom
                  value={hospitalTag}
                  onChange={(e) => setHospitalTag(e.target.value)}
                  style={{ padding: "5%", marginTop: " 12%" }}
                >
                  <option value="" style={{ textAlign: "center" }}>
                    Filters
                  </option>
                  {availableTags.map((tag) => (
                    <option
                      style={{ textAlign: "center" }}
                      key={tag}
                      value={tag}
                    >
                      {tag}
                    </option>
                  ))}
                </Form.Control>
              </div>
            </Form.Group>
          </div>
        </Col>
        <Col lg={{ span: "5", offset: "" }} className="">
          <Button
            variant="success"
            style={{ width: "38%", marginLeft: "47%", marginTop: "4.5%" }}
            className="round-border"
            // onClick={handleLogout}
          >
            <img src={downloadicon} alt="" width="20px" />
            <span style={{ marginLeft: "7%" }}>
              Export list as CVS
            </span>
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
                          style={{ width: "90%", height: "auto" }}
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

const MainNav = () => {
  return (
    <Row className="grey-border-bottom" style={{ padding: "1% 5%" }}>
      <Col className="">
        <img src={frame10} alt="" width="40%" />
      </Col>
      <Col
        className=""
        lg={{ span: "5", offset: "4" }}
        style={{ padding: "0%" }}
      >
        <ul
          className="MainNav-Ul"
          style={{
            listStyle: "none",
            display: "flex",
            margin: "0",
          }}
        >
          <li>
            <span>
              <img
                src={Icon2}
                alt=""
                width="20px"
                style={{ marginRight: "14px", marginBottom: "5px" }}
              />
            </span>
            Find Hospitals
          </li>
          <li>
            <img
              src={Icon1}
              alt=""
              width="20px"
              style={{ marginRight: "14px", marginBottom: "3px" }}
            />
            Saved
          </li>
          <Link to="/login" style={{ textDecoration: "none", color: "black"}}>
          <li>
            <span
              className="rounded-circle"
              style={{
                backgroundColor: "#D9D9D9",
                marginRight: "14px",
                padding: "2px 6px",
              }}
            >
              <img src={Icon3} alt="" width="12px" style={{}} />
            </span>
            My Profile
          </li>
          </Link>
        </ul>
      </Col>
    </Row>
  );
};

function Landing() {
  return (
    <Container fluid style={{}}>
      <MainNav />
      <HospitalsDataBase />
    </Container>
  );
}

export default Landing;
