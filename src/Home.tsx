import React from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../backend/config";
import { set, ref, push } from "firebase/database";
import createDummyGame from "../helper-functions/createDummyGame";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const allGamesRef = ref(database, "games");
  const newGameRef = push(allGamesRef);
  const dummyGame = createDummyGame();
  const createGame = () => {
    set(newGameRef, {
      whoseTurn: "red",
      gameState: dummyGame,
    });
  };

  return (
    <>
      <button
        onClick={() => {
          createGame();
          navigate(`/games/${newGameRef.key}`);
        }}
      >
        Create Game
      </button>
    </>
  );
};

export default Home;
