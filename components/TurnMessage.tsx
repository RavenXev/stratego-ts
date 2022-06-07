import { Alert } from "@chakra-ui/react";
import React from "react";
import makeAttackReport from "../helper-functions/makeAttackReport";
import { dbGameProps } from "../src/Game";

interface MessageProp {
  dbGame: dbGameProps;
  userId: string;
}

const TurnMessage: React.FC<MessageProp> = ({ dbGame, userId }) => {
  return (
    <>
      {!dbGame.wasLastMoveAttack && (
        <Alert
          status={dbGame[dbGame.whoseTurn] == userId ? "success" : "warning"}
          variant="subtle"
          color="gray.800"
          fontSize="lg"
          maxW="100%"
        >
          {dbGame[dbGame.whoseTurn] == userId
            ? "It is your turn!"
            : "Waiting for opponent's move..."}
        </Alert>
      )}
      {dbGame.wasLastMoveAttack && (
        <Alert bg={"gray.300"} color="gray.800" maxW="100%">
          {makeAttackReport(dbGame, userId)}
        </Alert>
      )}
    </>
  );
};

export default TurnMessage;
