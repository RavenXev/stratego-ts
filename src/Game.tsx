import React, { useEffect, useState } from "react";
import Piece from "../helper-functions/Piece";
import Square from "../components/Square";
import getAvailableMoves from "../helper-functions/getAvailableMoves";
import TurnMessage from "../components/TurnMessage";
import captureSquare from "../helper-functions/captureSquare";
import { useNavigate, useParams } from "react-router-dom";
import { database } from "../backend/config";
import { ref, set, onDisconnect, update, remove } from "firebase/database";
import { useObjectVal } from "react-firebase-hooks/database";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  Center,
  Flex,
  Grid,
  Heading,
  IconButton,
  Text,
  VStack,
} from "@chakra-ui/react";
import getLastMove, {
  ReturnLastMovesProps,
} from "../helper-functions/getLastMove";
import SetupPage from "../components/SetupPage";
import { BiHome } from "react-icons/bi";
export interface dbGameProps {
  red: string;
  blue: string;
  gameState: Piece[];
  whoseTurn: "red" | "blue";
  lastMoves: ReturnLastMovesProps;
  lastActivePiece: Piece;
  wasLastMoveAttack: boolean;
  lastAttack: Piece[];
  isRedReady: boolean;
  isBlueReady: boolean;
  isGameStarted: boolean;
  isGameOver: boolean;
  setups: { red: Piece[]; blue: Piece[] };
}
interface userIdProp {
  userId: string;
}

const Game: React.FC<userIdProp> = ({ userId }) => {
  const { id: gameId } = useParams();
  const dbGameReference = ref(database, `games/${gameId}`);
  const [dbGame] = useObjectVal<dbGameProps>(dbGameReference);
  const [localGameState, setLocalGameState] = useState<Piece[]>();
  const [activeSquare, setActiveSquare] = useState<Piece>({
    rank: null,
    position: -1,
    color: "transparent",
    highlighted: false,
  });

  let navigate = useNavigate();

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
      let currentPlayerUpdateObject: {
        red?: string;
        blue?: string;
        isRedReady?: boolean;
        isBlueReady?: boolean;
      } = {};

      if (dbGame.red == userId) {
        currentPlayerUpdateObject["red"] = "";
        currentPlayerUpdateObject["isRedReady"] = false;
      } else if (dbGame.blue == userId) {
        currentPlayerUpdateObject["blue"] = "";
        currentPlayerUpdateObject["isBlueReady"] = false;
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

    //clicked on highlighted piece
    if (highlighted === true) {
      dbGameCopy.wasLastMoveAttack = false;
      dbGameCopy.lastAttack = [];
      if (rank != null) {
        dbGameCopy.wasLastMoveAttack = true;
        dbGameCopy.lastAttack = [activeSquare, { ...piece }];
      }

      if (rank == 0) {
        dbGameCopy.isGameOver = true;
      }

      //Delay the attack somehow here, show the active square and the clicked square temporarily.
      //spread a new list to the database to temporarily show the active attack
      dbGameCopy.gameState = captureSquare(
        activeSquare["position"],
        position,
        dbGameCopy.gameState
      );
      for (let i = 0; i < 100; i++) {
        dbGameCopy.gameState[i].highlighted = false;
      }

      dbGameCopy.whoseTurn = dbGameCopy.whoseTurn === "red" ? "blue" : "red";
      dbGameCopy.lastActivePiece = piece;
      dbGameCopy.lastMoves = getLastMove(activeSquare.position, position);
      set(dbGameReference, dbGameCopy);
    }

    // player did not click on highlighted piece
    else if (highlighted == false) {
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
      setActiveSquare({ ...piece });
      setLocalGameState(dbGameCopy.gameState);
    }
  };

  function isPieceDisplayed(piece: Piece): boolean {
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
  }

  if (!dbGame || !localGameState) return <> waiting... </>;

  return (
    <>
      <Center w="100vw" h="100vh">
        <VStack
          w={["100vw", "90vw", "80vw", "75vw", "50vw", "40vw"]}
          maxH="90vh"
        >
          {!dbGame.isGameStarted &&
            (dbGame.isBlueReady == false || dbGame.isRedReady == false) && (
              <SetupPage
                dbGame={dbGame}
                userId={userId}
                saveState={(newGame: dbGameProps) => {
                  if (
                    newGame.setups.red.length == 40 &&
                    newGame.setups.blue.length == 40 &&
                    newGame.isBlueReady &&
                    newGame.isRedReady
                  ) {
                    newGame.gameState.splice(60, 40, ...newGame.setups.red);
                    newGame.gameState.splice(0, 40, ...newGame.setups.blue);
                    newGame.isGameStarted = true;
                  }
                  set(dbGameReference, newGame);
                }}
              />
            )}

          {dbGame.isGameStarted &&
            !dbGame.isGameOver &&
            ((dbGame.red == userId && dbGame.blue == "") ||
              (dbGame.blue == userId && dbGame.red == "")) && (
              <Alert status="error">
                <AlertIcon />
                <AlertTitle>Opponent disconnected! </AlertTitle>
                Send them this game code or go back to home
                <IconButton
                  aria-label="Home button"
                  colorScheme="red"
                  icon={<BiHome />}
                  size="sm"
                  ml="auto"
                  onClick={() => {
                    remove(dbGameReference);
                    navigate("/");
                  }}
                />
              </Alert>
            )}

          {dbGame.isGameStarted && !dbGame.isGameOver && (
            <>
              <TurnMessage dbGame={dbGame} userId={userId} />
              <Grid
                h={["100vw", "90vw", "80vw", "75vw", "50vw", "40vw"]}
                maxW="100vw"
                templateColumns="repeat(10,1fr)"
                templateRows="repeat(10,1fr)"
                gap="1px"
                opacity={dbGame[dbGame.whoseTurn] == userId ? 1.0 : 0.6}
              >
                {dbGame.red == userId &&
                  localGameState.map((piece: Piece) => {
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
                        isBlue={false}
                      />
                    );
                  })}

                {dbGame.blue == userId &&
                  localGameState
                    .map((piece: Piece) => {
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
                          isBlue={true}
                        />
                      );
                    })
                    .reverse()}
              </Grid>
            </>
          )}

          {dbGame.isGameOver && (
            <Flex
              direction="column"
              background="gray.100"
              p={12}
              rounded="base"
            >
              <Heading mb={12}> Stratego</Heading>
              <Button
                colorScheme="gray"
                mb={6}
                onClick={() => {
                  remove(dbGameReference);
                  navigate("/");
                }}
              >
                Go back home
              </Button>
              <Button colorScheme="whatsapp">Rematch?</Button>
            </Flex>
          )}
        </VStack>
      </Center>
    </>
  );
};

export default Game;
