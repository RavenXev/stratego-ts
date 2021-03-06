import React, { useState } from "react";
import {
  chakra,
  Box,
  useColorModeValue,
  Button,
  Stack,
  Image,
  useColorMode,
  IconButton,
  Input,
  useToast,
  Flex,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { database } from "../backend/config";
import { set, ref, get, remove, update } from "firebase/database";
import createDummyGame from "../helper-functions/createDummyGame";
import { ImSun } from "react-icons/im";
import { BiMoon } from "react-icons/bi";
import generateWord from "../helper-functions/generateWord";

interface userIdProp {
  userId: string;
}
import screenshot1 from "../screenshot1.png";
import screenshot2 from "../screenshot2.png";

const Home: React.FC<userIdProp> = ({ userId }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  const navigate = useNavigate();
  const userRef = ref(database, `/users/${userId}`);

  const newGameWord = generateWord();

  const dummyGame = createDummyGame();

  const [gameCode, setGameCode] = useState("");
  const [notFoundError, setNotFoundError] = useState(false);
  const toast = useToast();

  const handleSubmit: React.FormEventHandler = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    get(userRef).then((snapshot) => {
      if (snapshot.val().currentGame != "") {
        set(ref(database, `/games/${snapshot.val()["currentGame"]}`), {
          red: "",
          blue: "",
        });

        remove(ref(database, `/games/${snapshot.val()["currentGame"]}`));
      }
    });
    if (gameCode.length == 0) {
      setNotFoundError(true);
      toast({
        title: "Empty Game",
        description: "Paste a code into the box!",
        status: "error",
        isClosable: true,
      });
      return;
    }

    get(ref(database, `/games/${gameCode}`)).then((snapshot) => {
      if (snapshot.exists()) {
        navigate(`/games/${gameCode}`);
      } else {
        setNotFoundError(true);
        toast({
          title: "Game not found!",
          description: "Try another code.",
          status: "error",
          isClosable: true,
        });
      }
    });
  };

  const createGame = () => {
    get(userRef).then((snapshot) => {
      if (snapshot.val().currentGame != "") {
        remove(ref(database, `/games/${snapshot.val()["currentGame"]}`));
      }
    });

    set(userRef, {
      currentGame: newGameWord,
    });
    update(ref(database, `/games/${newGameWord}`), {
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
    <Box px={8} py={24} mx="auto">
      <Box
        w={{ base: "full", md: 11 / 12, xl: 9 / 12 }}
        mx="auto"
        textAlign={{ base: "left", md: "center" }}
      >
        <chakra.h1
          mb={6}
          fontSize={{ base: "4xl", md: "6xl" }}
          fontWeight="bold"
          lineHeight="none"
          letterSpacing={{ base: "normal", md: "tight" }}
          color={useColorModeValue("gray.900", "gray.100")}
        >
          Stratejist
        </chakra.h1>
        <chakra.p
          px={{ base: 0, lg: 24 }}
          mb={6}
          fontSize={{ base: "lg", md: "xl" }}
          color={useColorModeValue("gray.600", "gray.300")}
        >
          Play a game of stratego with a friend instantly.
        </chakra.p>
        <Stack
          direction={{ base: "column", sm: "row" }}
          mb={{ base: 4, md: 8 }}
          spacing={2}
          justifyContent={{ sm: "left", md: "center" }}
        >
          <Button
            variant="solid"
            colorScheme="red"
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            w={{ base: "full", sm: "auto" }}
            mb={{ base: 2, sm: 0 }}
            size="lg"
            cursor="pointer"
            onClick={() => {
              createGame();
              navigate(`/games/${newGameWord}`);
            }}
          >
            Play now!
          </Button>
          <form
            style={{
              colorScheme: "gray",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
            }}
            onSubmit={handleSubmit}
          >
            <Input
              isInvalid={notFoundError ? true : undefined}
              textTransform="uppercase"
              type="text"
              fontSize="sm"
              colorScheme="gray"
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              w={{ base: "full", sm: "auto" }}
              mb={{ base: 2, sm: 0 }}
              mr={1}
              size="lg"
              cursor="pointer"
              placeholder="Input game code"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                if (notFoundError) {
                  setNotFoundError(false);
                }
                setGameCode(event.target.value.trim().toUpperCase());
              }}
            />
            <Button
              type="submit"
              colorScheme="gray"
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              pl={3}
              pr={3}
              mb={{ base: 2, sm: 0 }}
              size="lg"
              cursor="pointer"
            >
              Join
            </Button>
          </form>
          <IconButton
            as="button"
            display="inline-flex"
            alignItems="center"
            justifyContent="center"
            alignSelf="center"
            w={3}
            mb={{ base: 2, sm: 0 }}
            size="lg"
            aria-label="toggle dark mode"
            onClick={toggleColorMode}
            icon={colorMode === "dark" ? <ImSun /> : <BiMoon />}
          />
        </Stack>
      </Box>
      <Box
        w={{ base: "full", md: 10 / 12 }}
        mx="auto"
        mt={20}
        textAlign="center"
      >
        <Image
          w="full"
          rounded="lg"
          shadow="2xl"
          src={colorMode == "light" ? screenshot1 : screenshot2}
          alt="screenshot of game"
        />
      </Box>
    </Box>
  );
};

export default Home;
