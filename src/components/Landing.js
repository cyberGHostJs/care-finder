import { useState } from "react";
import { Col, Container, Row, Form, Button } from "react-bootstrap";
import frame10 from "../images/Frame10.png";
import Icon1 from "../images/Icon1.png";
// import dropdownicon from "../images/dropdownicon.png";
import Icon2 from "../images/Icon2.png";
import Icon3 from "../images/Icon3.png";
import Icon8 from "../images/Icon8.png";
import calendaicon from "../images/calendaicon.png";
import clock from "../images/clock.png";
import mappin from "../images/mappin.png";
import filtericon from "../images/filtericon.png";
import downloadicon from "../images/downloadicon.png";
import hospitalpic1 from "../images/hospitalpic1.png";
import hospitalpic2 from "../images/hospitalpic2.png";
import hospitalpic3 from "../images/hospitalpic3.png";
import hospitalpic4 from "../images/hospitalpic4.png";
import { Link } from "react-router-dom";


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
  const [hospitals, setHospitals] = useState([
    {
      name: "Redcare Specialist Hospital",
      tags: ["laboratory"],
      image: hospitalpic1,
      location: "Admiralty Way, Lekki Phase I",
      date: "Mon - Fri",
      time: "8:00AM -10:00PM",
    },
    {
      name: "Elphy Maternity Hospital",
      tags: ["laboratory"],
      image: hospitalpic2,
      location: "Admiralty Way, Lekki ojo I",
      date: "Mon - Fri",
      time: "8:00AM -10:00PM",
    },
    {
      name: "Hospital C",
      tags: ["dentals"],
      image: hospitalpic3,
      location: "Admiralty Way, Lekki Phase I",
      date: "Mon - Fri",
      time: "8:00AM -10:00PM",
    },
    {
      name: "Hospital D",
      tags: ["dentals"],
      image: hospitalpic4,
      location: "Admiralty Way, Lekki Phase I",
      date: "Mon - Fri",
      time: "8:00AM -10:00PM",
    },
    {
      name: "Hospital E",
      tags: ["dentals", "surgery"],
      image: hospitalpic4,
      location: "Admiralty Way, Lekki Phase I",
      date: "Mon - Fri",
      time: "8:00AM -10:00PM",
    },
    {
      name: "Hospital F",
      tags: ["dentals", "surgery"],
      image: hospitalpic4,
      location: "Admiralty Way, Lekki Phase I",
      date: "Mon - Fri",
      time: "8:00AM -10:00PM",
    },
    {
      name: "Hospital G",
      tags: ["surgery"],
      image: hospitalpic4,
      location: "Admiralty Way, Lekki Phase I",
      date: "Mon - Fri",
      time: "8:00AM -10:00PM",
    },
    {
      name: "Hospital H",
      tags: ["surgery"],
      image: hospitalpic4,
      location: "Admiralty Way, Lekki Phase I",
      date: "Mon - Fri",
      time: "8:00AM -10:00PM",
    },
    // Add more hospitals with different tags and images
  ]);

  const [selectedTag, setSelectedTag] = useState("");
  const [searchedLocation, setSearchedLocation] = useState("");

  const uniqueTags = Array.from(
    new Set(hospitals.flatMap((hospital) => hospital.tags))
  );

  const filteredHospitals = selectedTag
    ? hospitals.filter(
        (hospital) =>
          hospital.tags.includes(selectedTag) &&
          hospital.location
            .toLowerCase()
            .includes(searchedLocation.toLowerCase())
      )
    : hospitals.filter((hospital) =>
        hospital.location.toLowerCase().includes(searchedLocation.toLowerCase())
      );

  const hospitalRows = [];
  let currentRow = [];

  filteredHospitals.forEach((hospital, index) => {
    currentRow.push(
      <Col key={hospital.name} lg={3} className="" style={{ fontSize: "14px" }}>
        <img src={hospital.image} alt={hospital.name} width="90%" />
        <h6 style={{ marginTop: "9%", fontSize: "14px", fontWeight: "700" }}>
          {hospital.name}
        </h6>
        <p style={{ margin: "3% auto" }}>
          {" "}
          <img src={mappin} alt="" width="5%"style={{ marginRight: "1%"}} /> {hospital.location}
        </p>
        <p>
          <img src={calendaicon} alt="" width="5%" style={{ marginRight: "1%"}}/> {hospital.date}{" "}
          <span style={{ marginLeft: "4%"}}>
            {" "}
            <img src={clock} alt="" width="5%" style={{ marginRight: "2%"}}/>
            {hospital.time}
          </span>
        </p>
      </Col>
    );

    if ((index + 1) % 4 === 0 || index === filteredHospitals.length - 1) {
      hospitalRows.push(
        <Row
          key={`row-${hospital.name}`}
          style={{
            marginBottom: "20px",
            width: "95%",
            margin: "5% auto",
            marginLeft: "4%",
          }}
        >
          {currentRow}
        </Row>
      );
      currentRow = [];
    }
  });

  const handleSearch = () => {
    setSelectedTag("");
  };

  return (
    <Container fluid style={{}}>
      <MainNav />
      <Row className="grey-border-bottom">
        <Col
          lg={{ span: "7", offset: "" }}
          className=""
          style={{ display: "flex", padding: "1%" }}
        >
          <Form.Group
            controlId="formBasicEmail"
            style={{ marginTop: "1%", marginLeft: "9%", width: "60%" }}
            className=""
          >
            <div className="search-input-group">
              <Form.Control
                style={{ padding: "2.5%" }}
                required
                className="round-border input-font-size input-padding-lf input-margin-buttom"
                type="text"
                placeholder="What is your location?"
                value={searchedLocation}
                onChange={(e) => setSearchedLocation(e.target.value)}
              />
              <Button
                variant="success"
                className="round-border search-button"
                onClick={handleSearch}
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
                <Form.Control
                  as="select"
                  size="sm"
                  className="round-border input-font-size input-padding-lf input-margin-buttom"
                  custom
                  value={selectedTag}
                  onChange={(e) => setSelectedTag(e.target.value)}
                  style={{ padding: "5%", marginTop: " 12%" }}
                >
                  <option value="" style={{ textAlign: "center" }}>
                    Filters
                  </option>
                  {uniqueTags.map((tag) => (
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
            onClick={handleSearch}
          >
            <img src={downloadicon} alt="" width="20px" />
            <span style={{ marginLeft: "7%" }}>Export list as CVS</span>
          </Button>
        </Col>
      </Row>
      {hospitalRows.length > 0 ? hospitalRows : <p>No hospitals found.</p>}
    </Container>
  );
}

export default Landing;
