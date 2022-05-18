import React, { useEffect, useState } from "react";
import "./Game.css";
import Piece from "../helper-functions/Piece";
import Square from "../components/Square";
import getAvailableMoves from "../helper-functions/getAvailableMoves";
import captureSquare from "../helper-functions/captureSquare";
import { useParams } from "react-router-dom";
import { database } from "../backend/config";
import { ref, set } from "firebase/database";
import { useObjectVal } from "react-firebase-hooks/database";

interface dbGameProps {
  hostId: string;
  opponent: string;
  gameState: Piece[];
  whoseTurn: string;
}

interface localGameProps {
  gameState: Piece[];
  activeSquare: Piece;
}

const Game: React.FC = () => {
  const { id: gameId } = useParams();
  const reference = ref(database, `games/${gameId}`);

  const [dbGame, dbGameLoading, dbGameError] =
    useObjectVal<dbGameProps>(reference);
  const [localGame, setLocalGame] = useState<localGameProps>();

  useEffect(() => {
    if (dbGame != null) {
      setLocalGame({
        gameState: dbGame.gameState,
        activeSquare: {
          rank: null,
          position: -1,
          color: "transparent",
          highlighted: false,
        },
      });
    }
  }, [dbGame]);
  const clickPiece = (piece: Piece) => {
    const { rank, position, color, highlighted } = piece;

    if (!localGame || !dbGame) return null;
    let newGame: dbGameProps = { ...dbGame };

    if (highlighted === true) {
      newGame.gameState = captureSquare(
        localGame.activeSquare["position"],
        position,
        dbGame.gameState
      );
      for (let i = 0; i < 100; i++) {
        newGame.gameState[i].highlighted = false;
      }
      newGame.whoseTurn = newGame.whoseTurn === "red" ? "blue" : "red";
      set(reference, newGame);
    } else {
      // if player did not click on highlighted piece
      for (let i = 0; i < 100; i++) {
        newGame.gameState[i].highlighted = false;
      }

      if (color !== newGame.whoseTurn) {
        return;
      }

      const availableMoves = getAvailableMoves(
        rank,
        position,
        color,
        newGame.gameState
      );
      for (const i of availableMoves) {
        newGame.gameState[i].highlighted = true;
      }

      setLocalGame({
        gameState: newGame.gameState,
        activeSquare: newGame.gameState[position],
      });
    }
  };

  if (dbGameLoading || !localGame) return <div> waiting ... </div>;

  return (
    <>
      <div className="Game">
        {localGame.gameState.map((piece: Piece) => {
          return (
            <Square
              key={piece.position}
              piece={piece}
              handleClick={() => clickPiece(piece)}
            />
          );
        })}
      </div>
      <h1> {gameId}</h1>
    </>
  );
};

export default Game;
