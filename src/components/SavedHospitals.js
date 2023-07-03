import { Col, Container, Row, Form, Button } from "react-bootstrap";
import loved from "../images/loved.png";
import redlove from "../images/redlove.svg";
import filtericon from "../images/filtericon.png";
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
import { CSVLink } from "react-csv";
import {NavBar} from "./welcome"

const HospitalsDataBase = () => {
  const [hospitalTag, setHospitalTag] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [allHospitals, setAllHospitals] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  //Add a state variable to track the exported data:
  const [exportedData, setExportedData] = useState([]);

  //Downloads savedHospitals
  const handleExport = () => {
    setExportedData(filteredHospitals.filter(hospital => likedHospitals.includes(hospital.id)));
  };

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
  const [likedHospitals, setLikedHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const unsubscribe = firestore
        .collection("users")
        .doc(currentUser.uid)
        .collection("likedHospitals")
        .onSnapshot((snapshot) => {
          const likedHospitalIds = snapshot.docs.map((doc) => doc.id);
          setLikedHospitals(likedHospitalIds);
          setLoading(false); // Set loading to false once the data is fetched
        });

      return () => unsubscribe();
    }
  }, [auth.currentUser, firestore]);

  const handleLikeHospital = (hospitalId) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      firestore
        .collection("users")
        .doc(currentUser.uid)
        .collection("likedHospitals")
        .doc(hospitalId)
        .set({
          liked: true,
        })
        .catch((error) => {
          console.error("Error liking hospital:", error);
          // Handle the error
        });
    } else {
      // Handle the case when the user is not authenticated
      // You can show an error message or redirect the user to the login page
    }
  };

  const handleUnlikeHospital = (hospitalId) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      firestore
        .collection("users")
        .doc(currentUser.uid)
        .collection("likedHospitals")
        .doc(hospitalId)
        .delete()
        .catch((error) => {
          console.error("Error unliking hospital:", error);
          // Handle the error
        });
    } else {
      // Handle the case when the user is not authenticated
      // You can show an error message or redirect the user to the login page
    }
  };

  return (
    <div>
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
          <Button
            variant="success"
            className="round-border expt-cvs-btn"
            onClick={handleExport}
          >
            <CSVLink
              style={{
                color: "white",
                textDecoration: "none",
                fontSize: "15px",
              }}
              data={exportedData}
              filename="search_results.csv"
              headers={[
                { label: "Name", key: "name" },
                { label: "Address", key: "address" },
                { label: "Email", key: "email" },
                { label: "Phone", key: "phone" },
              ]}
            >
              <img src={downloadicon} alt="" width="20px" className="cvs-img" />
              <span className="expt-cvs">Export as CVS</span>
            </CSVLink>
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
          {filteredHospitals
            .filter((hospital) => likedHospitals.includes(hospital.id))
            .map(
              (hospital) =>
                // Render hospitals based on the selected tag (if any)
                (hospitalTag === "" || hospital.tag.includes(hospitalTag)) && (
                  <Col
                    lg="3"
                    key={hospital.id}
                    className=""
                    style={{
                      fontSize: "14px",
                      marginBottom: "5%",
                      position: "relative",
                    }}
                  >
                    {" "}
                    <ReactMarkdown
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
                    {loading ? (
                      <p>Loading...</p>
                    ) : (
                      // Render the component once the data is fetched
                      <div
                        style={{
                          position: "absolute",
                          top: "3%",
                          right: "15%",
                          width: "15%",
                        }}
                      >
                        {likedHospitals.includes(hospital.id) ? (
                          <button
                            onClick={() => handleUnlikeHospital(hospital.id)}
                            style={{
                              border: "none",
                              borderRadius: "50%",
                              padding: "15% 20%",
                            }}
                          >
                            <img src={redlove} alt="loved" width="" />
                          </button>
                        ) : (
                          <button
                            style={{
                              border: "none",
                              borderRadius: "50%",
                              padding: "15% 20%",
                            }}
                            onClick={() => handleLikeHospital(hospital.id)}
                          >
                            <img src={loved} alt="loved" width="" />
                          </button>
                        )}
                      </div>
                    )}
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
          <button onClick={handleLogout}> Log Out</button>
        </Row>
      )}
    </div>
  );
};

function SavedHospital() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true); // New state variable
  useEffect(() => {
    // Check if user is authenticated
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is authenticated, retrieve user data from Firestore
        setIsLoading(true); // Set isLoading to true before making the database call
        firestore
          .collection("users")
          .doc(user.uid)
          .get()
          .then((doc) => {
            if (doc.exists) {
              setUser(doc.data());
            }
            setIsLoading(false); // Set isLoading to false after fetching the user data
          })
          .catch((error) => {
            console.error("Error retrieving user data:", error);
            setIsLoading(false); // Set isLoading to false in case of an error
          });
      } else {
        // User is not authenticated, redirect to the login page
        navigate("/login");
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return <div>Loading...</div>; // Render loading indicator while fetching user data
  }
  return (
    <Container fluid style={{}}>
      <NavBar />
      <HospitalsDataBase />
    </Container>
  );
}

export default SavedHospital;
