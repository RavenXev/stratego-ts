import React, { useEffect } from "react";
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
  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (!user) {
      signInAnonymously(auth).catch((error) => {
        console.log(error);
      });
    }
  }, [user]);
  console.log(user);
  if (user) {
    const userRef = ref(database, `/users/${user.uid}`);
    set(userRef, {
      id: user.uid,
    });
  }

  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home userId={user?.uid} />} />
          <Route path="/games/:id" element={<Game />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
