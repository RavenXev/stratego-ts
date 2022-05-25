import Piece from "../helper-functions/Piece";
import { Center, GridItem } from "@chakra-ui/react";
import { BiBomb, BiWater, BiFlag, BiX } from "react-icons/bi";
interface SquareProps {
  piece: Piece;
  isPieceDisplayed: boolean;
  activeSquare?: Piece;
  handleClick?: () => void;
}

const SquareTemplateProps = {
  border: "1px",
  borderColor: "gray.300",
  w: "100%",
};

const Square: React.FC<SquareProps> = ({
  piece,
  isPieceDisplayed,
  activeSquare,
  handleClick,
}) => {
  let { rank, position, color, highlighted } = piece;

  if (rank == -1) {
    // lakes in the middle
    return (
      <Center {...SquareTemplateProps} bg="#76E4F7" color="white">
        <BiWater size="50%" />
      </Center>
    );
  }

  if (!isPieceDisplayed) {
    if (highlighted == true && (color == "red" || color == "blue")) {
      // highlighted enemy piece
      return (
        <Center
          {...SquareTemplateProps}
          onClick={handleClick}
          bg={`${color}.200`}
          color={`${color}.700`}
        >
          <BiX size="90%" opacity="100%" />
        </Center>
      );
    } else {
      return (
        // enemy piece
        <Center
          {...SquareTemplateProps}
          onClick={handleClick}
          bg={`${color}.500`}
        >
          <GridItem></GridItem>
        </Center>
      );
    }
  } else if (isPieceDisplayed && rank === 99) {
    // your bombs
    return (
      <Center {...SquareTemplateProps} bg={`${color}.500`} color="white">
        <BiBomb size="50%" />
      </Center>
    );
  } else if (isPieceDisplayed && rank == 0) {
    // your flag
    return (
      <Center {...SquareTemplateProps} bg={`${color}.500`} color="white">
        <BiFlag size="50%" />
      </Center>
    );
  }

  //your movable pieces and yellow highlights
  return (
    <Center
      {...SquareTemplateProps}
      _hover={{ opacity: 0.5 }}
      onClick={handleClick}
      bg={
        activeSquare?.position == position
          ? `${color}.700`
          : highlighted == true
          ? "#F6E05E" // yellow highlight
          : `${color}.500`
      }
      color="white"
    >
      <GridItem fontSize="lg" fontWeight="bold">
        {rank}
      </GridItem>
    </Center>
  );
};

export default Square;
