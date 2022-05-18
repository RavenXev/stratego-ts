import React, { useEffect } from "react";
import { auth, database } from "../backend/config";
import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { ref, set, onDisconnect } from "firebase/database";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import Game from "./Game";
import Home from "./Home";

const App: React.FC = () => {
  const [user, loading, error] = useAuthState(auth);
  useEffect(() => {
    signInAnonymously(auth).catch((error) => {
      console.log(error);
    });
    const userRef = ref(database, `/users/${user?.uid}`);
    if (user) {
      set(userRef, {
        id: user.uid,
      });
    }
    onDisconnect(userRef).remove();
  }, [user]);

  console.log(user);
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/games/:id" element={<Game />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
