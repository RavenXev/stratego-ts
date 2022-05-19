import React, { useEffect, useState } from "react";
import Piece from "../helper-functions/Piece";
import Square from "../components/Square";
import getAvailableMoves from "../helper-functions/getAvailableMoves";
import captureSquare from "../helper-functions/captureSquare";
import { useParams } from "react-router-dom";
import { database } from "../backend/config";
import { ref, set } from "firebase/database";
import { useObjectVal } from "react-firebase-hooks/database";
import { Center, Grid } from "@chakra-ui/react";
interface dbGameProps {
  red: string;
  blue: string;
  gameState: Piece[];
  whoseTurn: "red" | "blue";
}

interface localGameProps {
  gameState: Piece[];
  activeSquare: Piece;
}

interface userIdProp {
  userId: string;
}

const Game: React.FC<userIdProp> = ({ userId }) => {
  const { id: gameId } = useParams();
  const dbGameReference = ref(database, `games/${gameId}`);

  const [dbGame, dbGameLoading, dbGameError] =
    useObjectVal<dbGameProps>(dbGameReference);
  const [localGame, setLocalGame] = useState<localGameProps>();

  useEffect(() => {
    if (dbGame != null) {
      if (dbGame.red != userId && dbGame.blue == null) {
        set(dbGameReference, { ...dbGame, blue: userId });
      }

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
    let dbGameCopy: dbGameProps = { ...dbGame };

    if (highlighted === true) {
      dbGameCopy.gameState = captureSquare(
        localGame.activeSquare["position"],
        position,
        dbGame.gameState
      );
      for (let i = 0; i < 100; i++) {
        dbGameCopy.gameState[i].highlighted = false;
      }
      dbGameCopy.whoseTurn = dbGameCopy.whoseTurn === "red" ? "blue" : "red";
      set(dbGameReference, dbGameCopy);
    } else {
      // player did not click on highlighted piece
      for (let i = 0; i < 100; i++) {
        dbGameCopy.gameState[i].highlighted = false;
      }

      if (color !== dbGameCopy.whoseTurn) {
        return;
      }

      const availableMoves = getAvailableMoves(
        rank,
        position,
        color,
        dbGameCopy.gameState
      );

      for (const i of availableMoves) {
        dbGameCopy.gameState[i].highlighted = true;
      }
      setLocalGame({
        gameState: dbGameCopy.gameState,
        activeSquare: dbGameCopy.gameState[position],
      });
    }
  };

  const showPiece = (piece: Piece) => {
    if (dbGame != null) {
      if (piece.rank == null || piece.rank == -1) {
        return true;
      }
      if (dbGame.red == userId && piece.color == "red") {
        return true;
      }
      if (dbGame.blue == userId && piece.color == "blue") {
        return true;
      }
    }
    return false;
  };

  if (!dbGame || !localGame) return <div> waiting ... </div>;

  return (
    <>
      <Center>
        <Grid
          templateColumns="repeat(10,50px)"
          templateRows="repeat(10, 50px)"
          gap="1px"
        >
          {localGame.gameState.map((piece: Piece) => {
            return (
              <Square
                key={piece.position}
                piece={piece}
                showPiece={showPiece(piece)}
                handleClick={
                  dbGame[dbGame.whoseTurn] == userId
                    ? () => clickPiece(piece)
                    : () => {
                        return;
                      }
                }
              />
            );
          })}
        </Grid>
      </Center>
      <p>Game: {gameId}</p>
      <p>p1: {userId}</p>
    </>
  );
};

export default Game;
