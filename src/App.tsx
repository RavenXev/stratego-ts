import React, { useState } from "react";
import "./App.css";
import Piece from "../helper-functions/Piece";
import Square from "./Square";
import createDummyGame from "../helper-functions/createDummyGame";
import getAvailableMoves from "../helper-functions/getAvailableMoves";
let dummyGame = createDummyGame();

const App: React.FC = () => {
  const [gameState, setGameState] = useState<Piece[]>(dummyGame);

  const clickPiece = (
    rank: Piece["rank"],
    position: Piece["position"],
    color: Piece["color"]
  ) => {
    console.log(rank, position, color);
    console.log(getAvailableMoves(rank, position, color, gameState));
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
            handleClick={() =>
              clickPiece(piece.rank, piece.position, piece.color)
            }
          />
        );
      })}
    </div>
  );
};

export default App;
