import Piece from "../helper-functions/Piece";

function createDummyGame() {
  let dummyGame: Piece[] = [];
  let ranks: Piece["rank"][] = [99, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  for (let i = 0; i < 100; i++) {
    const newSquare: Piece = { rank: 0, position: 0, color: undefined };
    newSquare.position = i;
    if (i <= 39) {
      newSquare.rank = ranks[Math.floor(Math.random() * ranks.length)];
      newSquare.color = "blue";
    } else if ([42, 43, 52, 53, 46, 47, 56, 57].includes(i)) {
      newSquare.rank = -1;
      newSquare.color = undefined;
    } else if (i <= 59) {
      newSquare.rank = null;
      newSquare.color = undefined;
    } else {
      newSquare.rank = ranks[Math.floor(Math.random() * ranks.length)];
      newSquare.color = "red";
    }

    dummyGame.push(newSquare);
  }

  return dummyGame;
}

export default createDummyGame;
