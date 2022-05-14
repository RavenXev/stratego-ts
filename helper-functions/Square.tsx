import Piece from "./Piece";

const Square: React.FC<Piece> = ({ rank, color, highlighted, handleClick }) => {
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
