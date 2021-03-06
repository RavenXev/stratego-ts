import Piece from "./Piece";

function captureSquare(
  position1: Piece["position"],
  position2: Piece["position"],
  board: Piece[]
): Piece[] {
  const attacker = board[position1];
  const opponent = board[position2];

  if (
    opponent.rank == null ||
    (attacker.rank === 1 && opponent.rank === 10) ||
    (attacker.rank === 3 && opponent.rank === 99)
  ) {
    opponent.rank = attacker.rank;
    opponent.color = attacker.color;

    attacker.rank = null;
    attacker.color = "transparent";
  } else if (attacker.rank === opponent.rank) {
    attacker.rank = null;
    attacker.color = "transparent";

    opponent.rank = null;
    opponent.color = "transparent";
  } else if (attacker.rank != null && attacker.rank > opponent.rank) {
    opponent.rank = attacker.rank;
    opponent.color = attacker.color;

    attacker.rank = null;
    attacker.color = "transparent";
  } else {
    attacker.rank = null;
    attacker.color = "transparent";
  }

  return board;
}

export default captureSquare;
