import Piece from "./Piece";

function captureSquare(position1: number, position2: number, board: Piece[]) {
  board[position2].rank = board[position1].rank;
  board[position2].color = board[position1].color;

  board[position1].rank = null;
  board[position1].color = undefined;
}

export default captureSquare;
