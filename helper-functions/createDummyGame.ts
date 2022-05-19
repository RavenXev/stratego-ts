import Piece from "../helper-functions/Piece";

function createDummyGame() {
  let dummyGame: Piece[] = [];
  let pieces: Piece["rank"][] = [
    99, 99, 99, 99, 99, 99, 10, 9, 8, 8, 7, 7, 7, 6, 6, 6, 6, 5, 5, 5, 5, 4, 4,
    4, 4, 3, 3, 3, 3, 3, 2, 2, 2, 2, 2, 2, 2, 2, 1, 0,
  ];
  let pieces2: Piece["rank"][] = [...pieces];
  function shuffleArray(array: Piece["rank"][]) {
    for (var i = array.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  }

  shuffleArray(pieces);
  shuffleArray(pieces2);
  for (let i = 0; i < 100; i++) {
    const newSquare: Piece = {
      rank: 0,
      position: 0,
      color: "transparent",
      highlighted: false,
    };
    newSquare.position = i;

    if (i <= 39) {
      newSquare.rank = pieces[i];
      newSquare.color = "blue";
    } else if ([42, 43, 52, 53, 46, 47, 56, 57].includes(i)) {
      newSquare.rank = -1;
      newSquare.color = "transparent";
    } else if (i <= 59) {
      newSquare.rank = null;
      newSquare.color = "transparent";
    } else {
      newSquare.rank = pieces2[i - 60];
      newSquare.color = "red";
    }

    dummyGame.push(newSquare);
  }

  return dummyGame;
}

export default createDummyGame;
