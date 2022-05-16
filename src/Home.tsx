import React from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../backend/config";
import { set, ref, push } from "firebase/database";

interface HomeProps {
  userId: string | undefined;
}

const Home: React.FC<HomeProps> = ({ userId }) => {
  const navigate = useNavigate();

  const createGame = () => {
    const allGamesRef = ref(database, "games");
    const gameRef = ref(database, "games/" + userId);
    set(gameRef, {
      id: userId,
      name: "hello",
    });
  };

  return (
    <>
      <button
        onClick={() => {
          createGame();
          console.log("hello again!");
          navigate("/game");
        }}
      >
        {" "}
        Create Game{" "}
      </button>
    </>
  );
};

export default Home;
