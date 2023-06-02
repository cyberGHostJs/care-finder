import React, { useState } from "react";
import "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, firestore } from "../firebase";
import firebase from "firebase/compat/app";

function AdminSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const navigate = useNavigate();

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      // Check if the email already exists in the admins collection
      const adminSnapshot = await firestore
        .collection("admins")
        .where("email", "==", email)
        .get();
      if (!adminSnapshot.empty) {
        throw new Error("Email already exists in admins collection.");
      }

      // Check if the email already exists in the users collection
      const userSnapshot = await firestore
        .collection("users")
        .where("email", "==", email)
        .get();
      if (!userSnapshot.empty) {
        throw new Error("Email already exists in users collection.");
      }

      // Create user with email and password
      const { user } = await auth.createUserWithEmailAndPassword(
        email,
        password
      );

      // Save additional user data to Firestore
      await firestore.collection("admins").doc(user.uid).set({
        email: user.email,
        fullName,
        phoneNumber,
        password,
      });

      // Clear sign-up form inputs
      setEmail("");
      setPassword("");
      setFullName("");
      setPhoneNumber("");

      // Redirect to the admin welcome page
      navigate("/adminWelcomePage");
    } catch (error) {
      console.error("Sign up error:", error);
      // Handle sign-up error and display an error message
    }
  };

  const handleSignUpWithGmail = async () => {
    try {
      // Create a Google provider instance
      const provider = new firebase.auth.GoogleAuthProvider();

      // Force the user to select their email every time
      provider.setCustomParameters({ prompt: "select_account" });

      // Sign in with Google popup
      const { user } = await auth.signInWithPopup(provider);

      // Check if the email already exists in the admins collection
      const adminSnapshot = await firestore
        .collection("admins")
        .where("email", "==", user.email)
        .get();
      if (!adminSnapshot.empty) {
        throw new Error("Email already exists in admins collection.");
      }

      // Check if the email already exists in the users collection
      const userSnapshot = await firestore
        .collection("users")
        .where("email", "==", user.email)
        .get();
      if (!userSnapshot.empty) {
        throw new Error("Email already exists in users collection.");
      }

      // Save additional user data to Firestore
      await firestore.collection("admins").doc(user.uid).set({
        email: user.email,
        fullName: user.displayName,
        phoneNumber: user.phoneNumber,
      });

      // Redirect to the welcome page
      navigate("/adminWelcomePage");
    } catch (error) {
      console.error("Sign up with Gmail error:", error);
      // Handle sign-up error with Gmail and display an error message
    }
  };

  return (
    <div className="container">
      <h1>Admin Signup</h1>
      <form onSubmit={handleSignUp}>
        {/* {error && <div className="error">{error}</div>} */}
        <input
          type="text"
          placeholder="Name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Signup</button>
        <button type="button" onClick={handleSignUpWithGmail}>
          Signup with Gmail
        </button>
      </form>
    </div>
  );
}

export default AdminSignup;
