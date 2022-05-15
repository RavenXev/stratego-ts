import Piece from "./Piece";

interface SquareProps {
  piece: Piece;
  handleClick?: () => void;
}

const Square: React.FC<SquareProps> = ({ piece, handleClick }) => {
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
      {rank}
    </div>
  );
};

export default Square;
