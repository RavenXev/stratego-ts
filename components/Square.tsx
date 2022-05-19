import Piece from "../helper-functions/Piece";

interface SquareProps {
  piece: Piece;
  showPiece: boolean;
  handleClick?: () => void;
}

const Square: React.FC<SquareProps> = ({ piece, showPiece, handleClick }) => {
  const { rank, color, highlighted } = piece;
  let newColor: Piece["color"] = color;
  if (highlighted == true) {
    newColor = "yellow";
  }

  return (
    <div
      className="square"
      style={{ backgroundColor: newColor }}
      onClick={handleClick}
    >
      {showPiece ? rank : ""}
    </div>
  );
};

export default Square;
