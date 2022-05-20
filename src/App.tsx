import React, { useEffect } from "react";
import { auth, database } from "../backend/config";
import { signInAnonymously } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { ref, set, onDisconnect, get } from "firebase/database";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
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
        currentGame: "",
      });
    }

    onDisconnect(userRef).remove();
  }, [user]);

  console.log(user);
  if (!user) return <div>loading user...</div>;
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home userId={user.uid} />} />
          <Route path="/games/:id" element={<Game userId={user.uid} />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
