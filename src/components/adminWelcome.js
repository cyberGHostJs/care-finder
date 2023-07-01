import {
  Col,
  Container,
  Row,
  Form,
  Button,
  Navbar,
  Nav,
} from "react-bootstrap";
import frame10 from "../images/Frame10.png";
import Icon1 from "../images/Icon1.png";
// import dropdownicon from "../images/dropdownicon.png";
import Icon2 from "../images/Icon2.png";
import Icon3 from "../images/Icon3.png";
import Icon8 from "../images/Icon8.png";
import filtericon from "../images/filtericon.png";
import downloadicon from "../images/downloadicon.png";
import calendaicon from "../images/calendaicon.png";
import clock from "../images/clock.png";
import mappin from "../images/mappin.png";
import firebase from "firebase/compat/app";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { auth, firestore } from "../firebase";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CSVLink } from "react-csv";

const HospitalsDataBase = () => {
  const [hospitalName, setHospitalName] = useState("");
  const [hospitalAddress, setHospitalAddress] = useState("");
  const [hospitalEmail, setHospitalEmail] = useState("");
  const [hospitalPhone, setHospitalPhone] = useState("");
  const [hospitalTime, setHospitalTime] = useState("");
  const [hospitalDays, setHospitalDays] = useState("");
  const [hospitalTag, setHospitalTag] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredHospitals, setFilteredHospitals] = useState([]);
  const [allHospitals, setAllHospitals] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [hospitalImage, setHospitalImage] = useState(""); // New state for the hospital image
  const [exportedData, setExportedData] = useState([]);

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

  const handleCreateHospital = async () => {
    try {
      // Split the hospital tags input by commas and store it as an array
      const tagsArray = hospitalTag.split(",").map((tag) => tag.trim());

      // Create a new hospital entry in Firestore
      await firestore.collection("hospitals").add({
        name: hospitalName,
        address: hospitalAddress,
        email: hospitalEmail,
        phone: hospitalPhone,
        days: hospitalDays,
        time: hospitalTime,
        tag: tagsArray,
        image: hospitalImage,
      });

      // Clear the hospital details input
      setHospitalName("");
      setHospitalAddress("");
      setHospitalEmail("");
      setHospitalPhone("");
      setHospitalDays("");
      setHospitalTime("");
      setHospitalTag("");
      setHospitalImage("");
    } catch (error) {
      console.error("Create hospital error:", error);
      // Handle create hospital error and display an error message
    }
  };

  const handleDeleteHospital = async (hospitalId) => {
    try {
      // Delete the hospital entry from Firestore
      await firestore.collection("hospitals").doc(hospitalId).delete();
    } catch (error) {
      console.error("Delete hospital error:", error);
      // Handle delete hospital error and display an error message
    }
  };

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

  const handleExport = () => {
    setExportedData(filteredHospitals);
  };

  return (
    <div>
      <Row className="grey-border-bottom">
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
                  <button onClick={() => handleDeleteHospital(hospital.id)}>
                    Delete
                  </button>
                </Col>
              )
          )}
          <button onClick={handleLogout}> Log Out</button>
        </Row>
      )}
      <h2>Create Hospital Entry</h2>
      <input
        type="text"
        value={hospitalName}
        onChange={(e) => setHospitalName(e.target.value)}
        placeholder="Hospital Name"
      />
      <input
        type="text"
        value={hospitalAddress}
        onChange={(e) => setHospitalAddress(e.target.value)}
        placeholder="Hospital Address"
      />
      <input
        type="text"
        value={hospitalEmail}
        onChange={(e) => setHospitalEmail(e.target.value)}
        placeholder="Hospital Email"
      />
      <input
        type="text"
        value={hospitalPhone}
        onChange={(e) => setHospitalPhone(e.target.value)}
        placeholder="Hospital Phone"
      />
      <input
        type="text"
        value={hospitalDays}
        onChange={(e) => setHospitalDays(e.target.value)}
        placeholder="Hospital days open"
      />
      <input
        type="text"
        value={hospitalTime}
        onChange={(e) => setHospitalTime(e.target.value)}
        placeholder="Hospital time open"
      />
      <input
        type="text"
        value={hospitalImage}
        onChange={(e) => setHospitalImage(e.target.value)}
        placeholder="Hospital image url"
      />{" "}
      <div>
        <ReactMarkdown
          remarkPlugins={[remarkGfm]}
          components={{
            img: ({ src, alt }) => (
              <img
                src={src}
                alt={alt}
                style={{ width: "30%", height: "auto" }}
              />
            ),
          }}
        >
          {hospitalImage}
        </ReactMarkdown>
      </div>
      <input
        type="text"
        value={hospitalTag}
        onChange={(e) => setHospitalTag(e.target.value)}
        placeholder="Hospital tags"
      />
      <button onClick={handleCreateHospital}>Create Hospital</button>
    </div>
  );
};

// const MainNav = () => {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   const [isNavFixed, setIsNavFixed] = useState(false);

//   useEffect(() => {
//     const handleScroll = () => {
//       if (window.scrollY > 100) {
//         setIsNavFixed(true);
//       } else {
//         setIsNavFixed(false);
//       }
//     };
//     window.addEventListener("scroll", handleScroll);
//     //clean up event listener
//     return () => {
//       window.removeEventListener("scroll", handleScroll);
//     };
//   }, []);

//   useEffect(() => {
//     // Check if user is authenticated
//     const unsubscribe = auth.onAuthStateChanged((user) => {
//       if (user) {
//         // User is authenticated, retrieve user data from Firestore
//         firestore
//           .collection("admins")
//           .doc(user.uid)
//           .get()
//           .then((doc) => {
//             if (doc.exists) {
//               setUser(doc.data());
//             }
//           })
//           .catch((error) => {
//             console.error("Error retrieving user data:", error);
//           });
//       } else {
//         // User is not authenticated, redirect to the login page
//         navigate("/login");
//       }
//     });

//     // Clean up the listener when the component unmounts
//     return () => unsubscribe();
//   }, [navigate]);

//   return (
//     <Row
//       className={
//         isNavFixed ? "fixed-top grey-border-bottom" : "grey-border-bottom"
//       }
//       style={{ padding: "1% 5%" }}
//     >
//       <Col className="">
//         <img src={frame10} alt="" width="40%" />
//       </Col>
//       <Col
//         className=""
//         lg={{ span: "5", offset: "4" }}
//         style={{ padding: "0%" }}
//       >
//         <ul
//           className="MainNav-Ul"
//           style={{
//             listStyle: "none",
//             display: "flex",
//             margin: "0",
//           }}
//         >
//           <li>
//             <span>
//               <img
//                 src={Icon2}
//                 alt=""
//                 width="20px"
//                 style={{ marginRight: "14px", marginBottom: "5px" }}
//               />
//             </span>
//             Find Hospitals
//           </li>
//           <li>
//             <img
//               src={Icon1}
//               alt=""
//               width="20px"
//               style={{ marginRight: "14px", marginBottom: "3px" }}
//             />
//             Saved
//           </li>
//           {user && (
//             <li>
//               <span
//                 className="rounded-circle"
//                 style={{
//                   backgroundColor: "#D9D9D9",
//                   marginRight: "14px",
//                   padding: "2px 6px",
//                 }}
//               >
//                 <img src={Icon3} alt="" width="12px" style={{}} />
//               </span>
//               {user.fullName}
//             </li>
//           )}
//         </ul>
//       </Col>
//     </Row>
//   );
// };

export const NavBar = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [activeMenuItem, setActiveMenuItem] = useState("findHospitals");
  const location = useLocation();
  const [isNavFixed, setIsNavFixed] = useState(false);
  const [isLoading, setIsLoading] = useState(true); //
  const [nav, setNav] = useState(false);
  const [menuButtonColor, setMenuButtonColor] = useState("none");

  const HandleNav = () => {
    setMenuButtonColor(nav ? "none" : "white"); // Toggle between black and white
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

  useEffect(() => {
    // Update activeMenuItem based on the current location
    if (location.pathname === "/findHospitals") {
      setActiveMenuItem("findHospitals");
    } else if (location.pathname === "/savedHospitals") {
      setActiveMenuItem("saved");
    } else if (location.pathname === "/userProfile") {
      setActiveMenuItem("profile");
    }
  }, [location]);

  useEffect(() => {
    // Check if user is authenticated
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is authenticated, retrieve user data from Firestore
        firestore
          .collection("admins")
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
    return <div>loading...</div>; // Render loading indicator while fetching user data
  }

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
        <Navbar.Brand href="/welcome" className="nav-brand-landing">
          <img src={frame10} alt="" width="30%" className="nav-brand-img" />
        </Navbar.Brand>
        <Navbar.Toggle
          aria-controls="basic-navbar-nav"
          className="nav-menu"
          style={{ background: menuButtonColor }}
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
              onClick={() => {
                if (activeMenuItem === "findHospitals") {
                } else {
                  document.body.style.overflow = "scroll";
                }
              }}
              to="/adminWelcomePage"
              className={
                activeMenuItem === "findHospitals"
                  ? "nav-color-active find-hospital"
                  : "find-hospital nav-color"
              }
              // className="find-hospital"
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
              // onClick={() => {
              //   if (activeMenuItem === "saved") {
              //   } else {
              //     document.body.style.overflow = "scroll";
              //   }
              // }}
              // to="/savedHospitals"
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
            {user && (
              <Link
                // onClick={() => {
                //   if (activeMenuItem === "profile") {
                //   } else {
                //     document.body.style.overflow = "scroll";
                //   }
                // }}
                //   // to="/userProfile"
                className={
                  activeMenuItem === "profile"
                    ? "nav-color-active my-profile"
                    : "my-profile nav-color"
                }
                // className="my-profile"
              >
                <img
                  src={Icon3}
                  alt=""
                  width="22px"
                  className="rounded-circle my-profile-img"
                />
                {user.fullName}
              </Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </Row>
  );
};

function AdminWelcomePage() {
  return (
    <Container fluid style={{}}>
      <NavBar />
      <HospitalsDataBase />
    </Container>
  );
}

export default AdminWelcomePage;
