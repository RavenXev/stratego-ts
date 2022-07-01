import { Alert, Button, Stack, Text, useColorMode } from "@chakra-ui/react";
import React from "react";
import makeAttackReport from "../helper-functions/makeAttackReport";
import { dbGameProps } from "../components/Game";

interface MessageProp {
  dbGame: dbGameProps;
  userId: string;
}

const TurnMessage: React.FC<MessageProp> = ({ dbGame, userId }) => {
  const { colorMode } = useColorMode();

  return (
    <Alert
      status={dbGame[dbGame.whoseTurn] == userId ? "success" : "warning"}
      variant="subtle"
      colorScheme="gray"
      bg={colorMode == "light" ? "blackAlpha.200" : "whiteAlpha.200"}
      fontSize="lg"
      maxW="inherit"
      position="sticky"
      top="0"
      zIndex="200"
    >
      {dbGame.wasLastMoveAttack
        ? makeAttackReport(dbGame, userId)
        : dbGame[dbGame.whoseTurn] == userId
        ? "It is your turn! Click to move a piece."
        : "Waiting for opponent's move..."}
    </Alert>
  );
};

export default TurnMessage;
