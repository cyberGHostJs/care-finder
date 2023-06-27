import { NavBar } from "./welcome";
import { auth, firestore } from "../firebase";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const UserProfile = () => {
  const [isLoading, setIsLoading] = useState(true); //
  const [user, setUser] = useState(null);
  const [noteText, setNoteText] = useState(""); // State to hold the text of the note
  const [notes, setNotes] = useState([]); // State to hold the user's notes
  const navigate = useNavigate();
  const [editedNoteText, setEditedNoteText] = useState("");
  const [editingNoteId, setEditingNoteId] = useState("");

  useEffect(() => {
    // Check if user is authenticated
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // User is authenticated, retrieve user data from Firestore
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

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      const unsubscribe = firestore
        .collection("users")
        .doc(currentUser.uid)
        .collection("notes")
        .orderBy("timestamp", "desc") // Order notes by timestamp in descending order
        .onSnapshot((snapshot) => {
          const notesData = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setNotes(notesData);
        });

      return () => unsubscribe();
    }
  }, []);

  const handleNoteSubmit = (e) => {
    e.preventDefault();

    // Ensure note text is not empty
    if (noteText.trim() === "") {
      return;
    }

    const currentUser = auth.currentUser;
    if (currentUser) {
      firestore
        .collection("users")
        .doc(currentUser.uid)
        .collection("notes")
        .add({
          text: noteText,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        })
        .then(() => {
          // Reset the note text input
          setNoteText("");
        })
        .catch((error) => {
          console.error("Error creating note:", error);
          // Handle the error
        });
    }
  };

  const handleNoteDelete = (noteId) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      firestore
        .collection("users")
        .doc(currentUser.uid)
        .collection("notes")
        .doc(noteId)
        .delete()
        .catch((error) => {
          console.error("Error deleting note:", error);
          // Handle the error
        });
    }
  };

  const handleNoteEdit = (noteId) => {
    const note = notes.find((note) => note.id === noteId);
    if (note) {
      setEditingNoteId(noteId);
      setEditedNoteText(note.text);
    }
  };

  const handleNoteCancelEdit = () => {
    setEditingNoteId("");
    setEditedNoteText("");
  };

  const handleNoteSave = (noteId) => {
    const editedText = editedNoteText.trim();
    if (editedText === "") {
      return;
    }

    handleNoteEditInFirestore(noteId, editedText);
    setEditingNoteId("");
    setEditedNoteText("");
  };

  const handleNoteEditInFirestore = (noteId, newText) => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      firestore
        .collection("users")
        .doc(currentUser.uid)
        .collection("notes")
        .doc(noteId)
        .update({
          text: newText,
        })
        .catch((error) => {
          console.error("Error editing note:", error);
          // Handle the error
        });
    }
  };

  return (
    <div>
      <NavBar />
      {user && (
        <div>
          <h1>{user.fullName}</h1>
          <h1>{user.email}</h1>
        </div>
      )}
      {savedHospitals.length === 0 ? (
        <p>No saved hospitals found.</p>
      ) : (
        <p> you have {savedHospitals.length} saved hospitals</p>
      )}

      {/* Note creation form */}
      <form onSubmit={handleNoteSubmit}>
        <input
          type="text"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Enter your note..."
        />
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
          {noteText}
        </ReactMarkdown>
        </div>
        <button type="submit">Save Note</button>
      </form>

      {notes.map((note) => (
        <div key={note.id}>
          {editingNoteId === note.id ? (
            <div>
              <input
                type="text"
                value={editedNoteText}
                onChange={(e) => setEditedNoteText(e.target.value)}
              />
              <button onClick={() => handleNoteSave(note.id)}>Save</button>
              <button onClick={() => handleNoteCancelEdit()}>Cancel</button>
            </div>
          ) : (
            <div>
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
                {note.text}
              </ReactMarkdown>
              {note.timestamp && (
                <p>
                  date created: {note.timestamp.toDate().toLocaleDateString()}
                </p>
              )}
              <button onClick={() => handleNoteDelete(note.id)}>Delete</button>
              <button onClick={() => handleNoteEdit(note.id)}>Edit</button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default UserProfile;
