// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { database } from "../backend/config";
// import "@fontsource/fascinate-inline";
// import { set, ref, push, get, remove } from "firebase/database";
// import {
//   Flex,
//   Button,
//   Heading,
//   Input,
//   Alert,
//   AlertIcon,
//   Divider,
//   Text,
// } from "@chakra-ui/react";
// import createDummyGame from "../helper-functions/createDummyGame";

// interface userIdProp {
//   userId: string;
// }

// const Home: React.FC<userIdProp> = ({ userId }) => {

//   return (
//     <Flex height="100vh" alignItems="center" justifyContent="center">
//       <Flex
//         direction="column"
//         background="gray.100"
//         p={12}
//         rounded="base"
//         textAlign="center"
//       >
//         <Heading
//           mb={6}
//           fontSize="6xl"
//           color="gray.700"
//           fontFamily="Fascinate Inline, sans-serif"
//         >
//           Stratejist
//         </Heading>
//         <Text maxW="100%" mb={3} fontSize="lg">
//           Play a game of stratego with a friend!
//         </Text>
//         <Button
//           colorScheme="whatsapp"
//           mb={6}
//           onClick={() => {
//             createGame();
//             navigate(`/games/${newGameRef.key}`);
//           }}
//         >
//           Create Game
//         </Button>
//         <form
//           onSubmit={(event: React.FormEvent<HTMLFormElement>) => {
//             event.preventDefault();
//             get(ref(database, `/games/${gameCode}`)).then((snapshot) => {
//               if (snapshot.exists()) {
//                 navigate(`/games/${gameCode}`);
//               } else {
//                 setNotFoundError(true);
//               }
//             });
//           }}
//         >
//           <Input
//             variant="outline"
//             bg="white"
//             mb={1}
//             placeholder="Input game code here"
//             onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
//               if (notFoundError) {
//                 setNotFoundError(false);
//               }
//               setGameCode(event.target.value.trim());
//             }}
//           />
//           <Button colorScheme="messenger" type="submit" w="100%">
//             Join Game
//           </Button>
//         </form>
//         {notFoundError && (
//           <Alert status="error">
//             {" "}
//             <AlertIcon /> That game code is invalid! Try again.{" "}
//           </Alert>
//         )}
//       </Flex>
//     </Flex>
//   );
// };

// export default Home;

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
} from "@chakra-ui/react";
import { ImSun } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import { database } from "../backend/config";
import "@fontsource/fascinate-inline";
import { set, ref, push, get, remove } from "firebase/database";
import createDummyGame from "../helper-functions/createDummyGame";
import { BiMoon } from "react-icons/bi";
interface userIdProp {
  userId: string;
}
const KuttyHero: React.FC<userIdProp> = ({ userId }) => {
  const { colorMode, toggleColorMode } = useColorMode();

  const navigate = useNavigate();
  const userRef = ref(database, `/users/${userId}`);
  const allGamesRef = ref(database, "games");
  const newGameRef = push(allGamesRef);
  const dummyGame = createDummyGame();

  const [gameCode, setGameCode] = useState("");
  const [notFoundError, setNotFoundError] = useState(false);

  const handleSubmit: React.FormEventHandler = (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    console.log("submit");
    get(ref(database, `/games/${gameCode}`)).then((snapshot) => {
      if (snapshot.exists()) {
        navigate(`/games/${gameCode}`);
      } else {
        setNotFoundError(true);
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
              navigate(`/games/${newGameRef.key}`);
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
              fontSize="sm"
              colorScheme="gray"
              display="inline-flex"
              alignItems="center"
              justifyContent="center"
              w={{ base: "full", sm: "auto" }}
              mb={{ base: 2, sm: 0 }}
              size="lg"
              cursor="pointer"
              placeholder="Input game code"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                if (notFoundError) {
                  setNotFoundError(false);
                }
                setGameCode(event.target.value.trim());
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
          src="../components/screenshot.png"
          alt="Hellonext feedback boards software screenshot"
        />
      </Box>
    </Box>
  );
};

export default KuttyHero;
