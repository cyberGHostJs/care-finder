// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { auth, firestore } from "../firebase";
// import ReactMarkdown from "react-markdown";
// import remarkGfm from "remark-gfm";
// import { CSVLink } from "react-csv";

import { Col, Container, Row, Form, Button } from "react-bootstrap";
import frame10 from "../images/Frame10.png";
import Icon1 from "../images/Icon1.png";
import loved from "../images/loved.png";
import redlove from "../images/redlove.svg";
import { MainNav } from "../components/welcome";
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
import { Link, useNavigate } from "react-router-dom";
import { auth, firestore } from "../firebase";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CSVLink } from "react-csv";

const SavedHospital = () => {
  const [savedHospitals, setSavedHospitals] = useState([]);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const unsubscribe = firestore
        .collection("users")
        .doc(currentUser.uid)
        .collection("likedHospitals")
        .onSnapshot((snapshot) => {
          const hospitalPromises = snapshot.docs.map((doc) => {
            const hospitalRef = firestore.collection("hospitals").doc(doc.id);
            return hospitalRef.get();
          });

          Promise.all(hospitalPromises)
            .then((hospitalSnapshots) => {
              const hospitalsData = hospitalSnapshots.map(
                (hospitalSnapshot) => ({
                  id: hospitalSnapshot.id,
                  ...hospitalSnapshot.data(),
                })
              );
              setSavedHospitals(hospitalsData);
            })
            .catch((error) => {
              console.error("Error retrieving saved hospitals:", error);
              // Handle the error
            });
        });

      return () => unsubscribe();
    }
  }, []);

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
    <Container>
      <MainNav />
      {savedHospitals.length === 0 ? (
        <p>No saved hospitals found.</p>
      ) : (
        <Row
          style={{
            marginBottom: "20px",
            width: "95%",
            margin: "5% auto",
            marginLeft: "4%",
          }}
        >
          {savedHospitals.map((hospital) => (
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
              <div
                style={{
                  position: "absolute",
                  top: "3%",
                  right: "15%",
                  width: "15%",
                }}
              >
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
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: "700" }}>
                {hospital.name}
              </h3>{" "}
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
              <p>{hospital.phone}</p>{" "}
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default SavedHospital;
