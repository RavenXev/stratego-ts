import React, { useEffect, useState } from "react";
import "./Game.css";
import Piece from "../helper-functions/Piece";
import Square from "../components/Square";
import getAvailableMoves from "../helper-functions/getAvailableMoves";
import captureSquare from "../helper-functions/captureSquare";
import { useParams } from "react-router-dom";
import { database } from "../backend/config";
import { ref, onValue, off, set } from "firebase/database";

interface GameProps {
  hostId: string;
  opponent: string;
  gameState: Piece[];
  whoseTurn: string;
  activeSquare: { color: string; highlighted: boolean; position: number };
}

const Game: React.FC = () => {
  // const [gameState, setGameState] = useState<Piece[]>(dummyGame);
  // const [whoseTurn, setWhoseTurn] = useState<Piece["color"]>("red");
  // const [activeSquare, setActiveSquare] = useState<Piece>({
  //   rank: null,
  //   position: -1,
  //   color: "transparent",
  //   highlighted: false,
  // });

  const [game, setGame] = useState<GameProps | null>(null);
  const { id } = useParams();
  const reference = ref(database, `games/${id}`);

  useEffect(() => {
    onValue(reference, (snapshot) => {
      setGame(snapshot.val());
    });

    return () => off(reference);
  }, []);

  const clickPiece = (piece: Piece) => {
    const { rank, position, color, highlighted } = piece;

    if (!game) return;
    let newGame: GameProps = { ...game };
    newGame.activeSquare = newGame.gameState[position];

    if (highlighted === true) {
      newGame.gameState = captureSquare(
        game.activeSquare["position"],
        position,
        game.gameState
      );
      for (let i = 0; i < 100; i++) {
        newGame.gameState[i].highlighted = false;
      }
      newGame.whoseTurn = newGame.whoseTurn === "red" ? "blue" : "red";
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
    }

    set(reference, newGame);
  };

  if (!game) return <> nope </>;
  return (
    <>
      <div className="Game">
        {game.gameState.map((piece: Piece) => {
          return (
            <Square
              key={piece.position}
              piece={piece}
              handleClick={() => clickPiece(piece)}
            />
          );
        })}
      </div>
      <h1> {id}</h1>
    </>
  );
};

export default Game;
