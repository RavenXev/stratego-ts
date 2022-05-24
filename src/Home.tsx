import React from "react";
import { useLocation, useNavigate, useNavigationType } from "react-router-dom";
import { database } from "../backend/config";
import { set, ref, push, child } from "firebase/database";
import { Flex, Button, Heading } from "@chakra-ui/react";
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

  const createGame = () => {
    set(userRef, {
      currentGame: newGameRef.key,
    });

    set(newGameRef, {
      whoseTurn: "red",
      gameState: dummyGame,
      red: userId,
      blue: "",
      lastMove: [
        {
          rank: null,
          position: -1,
          color: "transparent",
          highlighted: false,
        },
      ],
    });
  };

  return (
    <Flex height="100vh" alignItems="center" justifyContent="center">
      <Flex direction="column" background="gray.100" p={12} rounded="base">
        <Heading mb={12}> Stratego</Heading>
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
        <Button colorScheme="messenger">Join Game</Button>
      </Flex>
    </Flex>
  );
};

export default Home;
