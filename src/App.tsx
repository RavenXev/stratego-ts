import React, { useState } from "react";
import "./App.css";
import Piece from "../helper-functions/Piece";
import Square from "../helper-functions/Square";
import createDummyGame from "../helper-functions/createDummyGame";
import getAvailableMoves from "../helper-functions/getAvailableMoves";
import captureSquare from "../helper-functions/captureSquare";
let dummyGame = createDummyGame();

const App: React.FC = () => {
  const [gameState, setGameState] = useState<Piece[]>(dummyGame);
  const [activeSquare, setActiveSquare] = useState<Piece>({
    rank: null,
    position: -1,
    color: undefined,
    highlighted: false,
  });
  const clickPiece = (
    rank: Piece["rank"],
    position: Piece["position"],
    color: Piece["color"],
    highlighted: Piece["highlighted"]
  ) => {
    let newGameState = [...gameState];
    setActiveSquare(newGameState[position]);

    if (highlighted === true) {
      newGameState = captureSquare(
        activeSquare["position"],
        position,
        gameState
      );
      for (let i = 0; i < newGameState.length; i++) {
        newGameState[i].highlighted = false;
      }
    } else {
      for (let i = 0; i < newGameState.length; i++) {
        newGameState[i].highlighted = false;
      }
      const availableMoves = getAvailableMoves(
        rank,
        position,
        color,
        gameState
      );
      for (const i of availableMoves) {
        newGameState[i].highlighted = true;
      }
    }

    setGameState(newGameState);
  };

  return (
    <div className="App">
      {gameState.map((piece: Piece) => {
        return (
          <Square
            key={piece.position}
            rank={piece.rank}
            position={piece.position}
            color={piece.color}
            highlighted={piece.highlighted}
            handleClick={() =>
              clickPiece(
                piece.rank,
                piece.position,
                piece.color,
                piece.highlighted
              )
            }
          />
        );
      })}
    </div>
  );
};

export default App;
