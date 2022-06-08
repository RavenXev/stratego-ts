import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { database } from "../backend/config";
import "@fontsource/fascinate-inline";
import { set, ref, push, get, remove } from "firebase/database";
import {
  Flex,
  Button,
  Heading,
  Input,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import createDummyGame from "../helper-functions/createDummyGame";

interface userIdProp {
  userId: string;
}

const Home: React.FC<userIdProp> = ({ userId }) => {
  const navigate = useNavigate();
  const userRef = ref(database, `/users/${userId}`);
  const allGamesRef = ref(database, "games");
  const newGameRef = push(allGamesRef);
  const dummyGame = createDummyGame();

  const [gameCode, setGameCode] = useState("");
  const [notFoundError, setNotFoundError] = useState(false);

  const createGame = () => {
    get(userRef).then((snapshot) => {
      if (snapshot.val().currentGame != "") {
        remove(ref(database, `/games/${snapshot.val()["currentGame"]}`));
      }
    });

    set(userRef, {
      currentGame: newGameRef.key,
    });

    set(newGameRef, {
      whoseTurn: "red",
      gameState: dummyGame,
      red: userId,
      blue: "",
      lastMoves: [
        {
          rank: null,
          position: -1,
          color: "transparent",
          highlighted: false,
        },
      ],
      lastActivePiece: {
        rank: null,
        position: -1,
        color: "transparent",
        highlighted: false,
      },
      wasLastMoveAttack: false,
      lastAttack: [],
      isBlueReady: false,
      isRedReady: false,
      rematchRed: false,
      rematchBlue: false,
      isGameStarted: false,
      isGameOver: false,
      winner: null,
      setups: {
        red: [
          {
            rank: null,
            position: -1,
            color: "transparent",
            highlighted: false,
          },
        ],
        blue: [
          {
            rank: null,
            position: -1,
            color: "transparent",
            highlighted: false,
          },
        ],
      },
    });
  };

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Flex
        direction="column"
        background="gray.100"
        p={12}
        rounded="base"
        textAlign="center"
      >
        <Heading
          mb={12}
          fontSize="6xl"
          color="gray.700"
          fontFamily="Fascinate Inline, sans-serif"
        >
          Stratejist
        </Heading>
        <Button
          colorScheme="whatsapp"
          mb={6}
          onClick={() => {
            createGame();
            navigate(`/games/${newGameRef.key}`);
          }}
        >
          Create Game
        </Button>
        <form
          onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
            event.preventDefault();
            get(ref(database, `/games/${gameCode}`)).then((snapshot) => {
              if (snapshot.exists()) {
                navigate(`/games/${gameCode}`);
              } else {
                setNotFoundError(true);
              }
            });
          }}
        >
          <Input
            variant="outline"
            bg="white"
            mb={1}
            placeholder="Input game code here"
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              if (notFoundError) {
                setNotFoundError(false);
              }
              setGameCode(event.target.value.trim());
            }}
          />
          <Button colorScheme="messenger" type="submit" w="100%">
            Join Game
          </Button>
        </form>
        {notFoundError && (
          <Alert status="error">
            {" "}
            <AlertIcon /> That game code is invalid! Try again.{" "}
          </Alert>
        )}
      </Flex>
    </Flex>
  );
};

export default Home;
