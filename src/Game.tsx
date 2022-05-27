import React, { useEffect, useState } from "react";
import Piece from "../helper-functions/Piece";
import Square from "../components/Square";
import getAvailableMoves from "../helper-functions/getAvailableMoves";
import captureSquare from "../helper-functions/captureSquare";
import { useParams } from "react-router-dom";
import { database } from "../backend/config";
import { ref, set, onDisconnect } from "firebase/database";
import { useObjectVal } from "react-firebase-hooks/database";
import { Center, Grid, Alert, VStack } from "@chakra-ui/react";
import getLastMove, {
  ReturnLastMovesProps,
} from "../helper-functions/getLastMove";
interface dbGameProps {
  red: string;
  blue: string;
  gameState: Piece[];
  whoseTurn: "red" | "blue";
  lastMoves: ReturnLastMovesProps;
  lastActivePiece: Piece;
  wasLastMoveAttack: boolean;
}

interface userIdProp {
  userId: string;
}

const Game: React.FC<userIdProp> = ({ userId }) => {
  const { id: gameId } = useParams();
  const dbGameReference = ref(database, `games/${gameId}`);
  const [dbGame, dbGameLoading, dbGameError] =
    useObjectVal<dbGameProps>(dbGameReference);
  const [localGameState, setLocalGameState] = useState<Piece[]>();
  const [activeSquare, setActiveSquare] = useState<Piece>({
    rank: null,
    position: -1,
    color: "transparent",
    highlighted: false,
  });

  useEffect(() => {
    if (dbGame != null) {
      //check if there is a blank player
      //set other player to userId
      if (dbGame.red != userId && dbGame.blue === "") {
        set(dbGameReference, { ...dbGame, blue: userId });
      }
      if (dbGame.blue != userId && dbGame.red === "") {
        set(dbGameReference, { ...dbGame, red: userId });
      }

      //set userId
      const userRef = ref(database, `/users/${userId}`);
      set(userRef, {
        currentGame: gameId,
      });

      //set onDisconnect update object
      let currentPlayerUpdateObject: { red?: string; blue?: string } = {};
      if (dbGame.red == userId) {
        currentPlayerUpdateObject["red"] = "";
      } else if (dbGame.blue == userId) {
        currentPlayerUpdateObject["blue"] = "";
      }
      //onDisconnect logic
      const onDisconnectRef = onDisconnect(dbGameReference);
      if (dbGame.red == "" || dbGame.blue == "") {
        onDisconnectRef.remove();
      } else if (dbGame.red !== "" && dbGame.blue !== "") {
        onDisconnectRef.cancel();
        onDisconnectRef.update(currentPlayerUpdateObject);
      }

      setLocalGameState(dbGame.gameState);
    }
  }, [dbGame]);

  const clickPiece = (piece: Piece) => {
    const { rank, position, color, highlighted } = piece;

    if (!dbGame) {
      // if there is no game in the database
      return;
    }

    if (dbGame[dbGame.whoseTurn] != userId) {
      // if its not the player's turn
      return;
    }

    let dbGameCopy: dbGameProps = { ...dbGame };

    if (highlighted === true) {
      //clicked on highlighted piece
      dbGameCopy.wasLastMoveAttack = false;
      if (dbGameCopy.gameState[position].color != "transparent") {
        dbGameCopy.wasLastMoveAttack = true;
      }
      dbGameCopy.gameState = captureSquare(
        activeSquare["position"],
        position,
        dbGame.gameState
      );
      for (let i = 0; i < 100; i++) {
        dbGameCopy.gameState[i].highlighted = false;
      }
      dbGameCopy.whoseTurn = dbGameCopy.whoseTurn === "red" ? "blue" : "red";
      dbGameCopy.lastActivePiece = dbGameCopy.gameState[position];
      dbGameCopy.lastMoves = getLastMove(activeSquare.position, position);
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
      setLocalGameState(dbGameCopy.gameState);
      setActiveSquare(dbGameCopy.gameState[position]);
    }
  };

  const isPieceDisplayed = (piece: Piece) => {
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

  if (!dbGame || !localGameState) return <div> waiting ... </div>;
  if (!dbGame.blue || !dbGame.red) return <div>no second player!</div>;

  return (
    <>
      <Center w="100vw" h="100vh">
        <VStack>
          <Alert
            status={dbGame[dbGame.whoseTurn] == userId ? "success" : "warning"}
            variant="top-accent"
            color="gray.600"
          >
            {dbGame[dbGame.whoseTurn] == userId
              ? "It is your turn!"
              : "Waiting for opponent..."}
          </Alert>
          <Grid
            templateColumns="repeat(10,50px)"
            templateRows="repeat(10, 50px)"
            gap="1px"
            opacity={dbGame[dbGame.whoseTurn] == userId ? 1.0 : 0.6}
          >
            {localGameState.map((piece: Piece) => {
              return (
                <Square
                  key={piece.position}
                  piece={piece}
                  activeSquare={activeSquare}
                  lastActivePiece={dbGame.lastActivePiece}
                  lastMoves={dbGame.lastMoves}
                  whoseTurn={dbGame.whoseTurn}
                  isPieceDisplayed={isPieceDisplayed(piece)}
                  wasLastMoveAttack={dbGame.wasLastMoveAttack}
                  handleClick={() => clickPiece(piece)}
                />
              );
            })}
          </Grid>
        </VStack>
      </Center>
    </>
  );
};

export default Game;
