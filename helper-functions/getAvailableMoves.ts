/**
 * Returns array of all locations the piece can move to.
 * @param {number} rank rank of the piece.
 * @param {number} position location on the board.
 * @param {Array} board array of pieces on board
 */
import Piece from "../helper-functions/Piece";

function getAvailableMoves(
  rank: Piece["rank"],
  position: Piece["position"],
  color: Piece["color"],
  gameState: Piece[]
) {
  // if the rank is 0 (flag) or 99 (bomb), return an empty array.

  let anticolor: Piece["color"];
  if (color === "red") {
    anticolor = "blue";
  } else if (color === "blue") {
    anticolor = "red";
  }
  if (rank === 0 || rank === 99 || rank === null || rank === -1) {
    return [];
  }

  // check if the piece is on the right or left edge of the board
  // AKA if the piece is on 0,10,20,30,40,50,60,70,80,90
  // or 9,19,29,39,49,59,69,79,89,99.
  // for instance, a piece on 9 cannot move to 10 and vice versa.

  // everything else but a 2
  let validMoves = [position + 1, position - 1, position + 10, position - 10];
  if (position % 10 === 9) {
    validMoves = [position - 1, position + 10, position - 10];
  } else if (position % 10 === 0) {
    validMoves = [position + 1, position + 10, position - 10];
  }

  validMoves = validMoves.filter((position) => position >= 0 && position <= 99);
  validMoves = validMoves.filter(
    (currentPosition) =>
      gameState[currentPosition].rank === null ||
      gameState[currentPosition].color == anticolor
  );
  return validMoves;
}

export default getAvailableMoves;
