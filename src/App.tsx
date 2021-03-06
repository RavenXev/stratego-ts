import React, { useEffect } from "react";
import { auth, database } from "./backend/config";
import { signInAnonymously } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { ref, set, onDisconnect } from "firebase/database";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Game from "./components/Game";
import Home from "./components/Home";

const App: React.FC = () => {
  const [user] = useAuthState(auth);
  useEffect(() => {
    signInAnonymously(auth).catch((error) => {
      console.log(error);
    });
    const userRef = ref(database, `/users/${user?.uid}`);
    onDisconnect(userRef).remove();
    if (user) {
      set(userRef, {
        currentGame: "",
      });
    }
  }, [user]);

  if (!user) return <div>loading user...</div>;
  return (
    <>
      <Router>
        <Routes>
          <Route path="/" element={<Home userId={user.uid} />} />
          <Route path="/games/:id" element={<Game userId={user.uid} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </>
  );
};

export default App;
