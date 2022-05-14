import Piece from "../helper-functions/Piece";

const Square: React.FC<Piece> = ({ rank, color, handleClick }) => {
  return (
    <div
      className="square"
      style={{ backgroundColor: color }}
      onClick={handleClick}
    >
      {rank}
    </div>
  );
};

export default Square;
