import React from "react";
import { auth, database } from "../backend/config";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import {
  onDisconnect,
  ref,
  set,
  onValue,
  onChildAdded,
  DatabaseReference,
} from "firebase/database";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Game from "./Game";
import Home from "./Home";

const App: React.FC = () => {
  const [user] = useAuthState(auth);
  let userRef: DatabaseReference;

  onAuthStateChanged(auth, (user) => {
    if (user) {
      userRef = ref(database, "users/" + user.uid);
      set(userRef, {
        id: user.uid,
        name: "hello",
      });
      console.log(user?.uid);
    } else {
      // User is signed out
    }
    // onValue(allUsersRef, (snapshot) => {
    //   const data = snapshot.val();
    // });

    // onChildAdded(allGamesRef, (snapshot) => {
    //   const addedGame = snapshot.val();
    // });
    onDisconnect(userRef).remove();
  });

  signInAnonymously(auth).catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    // ...
  });

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home userId={user?.uid} />} />
          <Route path="/game" element={<Game />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
