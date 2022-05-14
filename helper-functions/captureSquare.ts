import Piece from "./Piece";

function captureSquare(
  position1: Piece["position"],
  position2: Piece["position"],
  board: Piece[]
): Piece[] {
  board[position2].rank = board[position1].rank;
  board[position2].color = board[position1].color;

  board[position1].rank = null;
  board[position1].color = undefined;

  return board;
}

export default captureSquare;
