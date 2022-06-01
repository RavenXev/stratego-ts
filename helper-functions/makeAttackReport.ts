import { Val } from "react-firebase-hooks/database/dist/database/types";
import { dbGameProps } from "../src/Game";

export default function makeAttackReport(
  dbGame: dbGameProps,
  userId: string
): string {
  if (
    dbGame == null ||
    !dbGame.lastAttack[0].rank ||
    !dbGame.lastAttack[1].rank
  )
    return "";
  let userColor: "red" | "blue" = "red";
  if (dbGame.blue == userId) {
    userColor = "blue";
  }
  let attackingPiece =
    dbGame.lastAttack[0].rank == 99 ? "bomb" : dbGame.lastAttack[0].rank;
  let defendingPiece =
    dbGame.lastAttack[1].rank == 99 ? "bomb" : dbGame.lastAttack[1].rank;

  //you are the attacking piece.
  if (dbGame.lastAttack[0].color == userColor) {
    if (dbGame.lastAttack[0].rank == 1 && dbGame.lastAttack[1].rank == 10) {
      return `Your spy (1) piece assasinated your opponent's 10 piece!`;
    } else if (
      dbGame.lastAttack[0].rank == 3 &&
      dbGame.lastAttack[1].rank == 99
    ) {
      return `Your miner (3) piece disarmed a bomb!`;
    } else if (dbGame.lastAttack[0].rank > dbGame.lastAttack[1].rank) {
      //you won the attack
      return `Your ${attackingPiece} piece captured your opponent's ${defendingPiece} piece!`;
    } else if (dbGame.lastAttack[0].rank < dbGame.lastAttack[1].rank) {
      // your piece lost the attack
      return `Your ${attackingPiece} piece failed to capture your opponent's ${defendingPiece} piece`;
    } else if (dbGame.lastAttack[0].rank == dbGame.lastAttack[1].rank) {
      //tie
      return `Your ${dbGame.lastAttack[0].rank} piece tied with your opponent's ${dbGame.lastAttack[1].rank} piece`;
    }
  }
  //you are the defending piece
  else if (dbGame.lastAttack[1].color == userColor) {
    if (dbGame.lastAttack[1].rank == 10 && dbGame.lastAttack[0].rank == 1) {
      return `Your 10 piece was assasinated by the opponent's spy (1)!`;
    } else if (
      dbGame.lastAttack[0].rank == 3 &&
      dbGame.lastAttack[1].rank == 99
    ) {
      return `The opponent's miner (3) destroyed your bomb!`;
    }

    if (dbGame.lastAttack[0].rank > dbGame.lastAttack[1].rank) {
      //you lost the attack
      return `Your ${defendingPiece} piece was captured by your opponent's ${attackingPiece} piece`;
    } else if (dbGame.lastAttack[0].rank < dbGame.lastAttack[1].rank) {
      // your piece won the attack
      return `Your ${defendingPiece} piece defended itself against your opponent's ${attackingPiece} piece`;
    } else if (dbGame.lastAttack[0].rank == dbGame.lastAttack[1].rank) {
      //tie
      return `Your ${dbGame.lastAttack[0].rank} piece tied with your opponent's ${dbGame.lastAttack[1].rank} piece`;
    }
  }

  return "";
}
