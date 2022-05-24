import Piece from "../helper-functions/Piece";
import { Center, GridItem } from "@chakra-ui/react";
import { BiBomb, BiWater, BiFlag, BiX } from "react-icons/bi";
interface SquareProps {
  piece: Piece;
  isPieceDisplayed: boolean;
  activeSquare?: Piece;
  handleClick?: () => void;
}

const Square: React.FC<SquareProps> = ({
  piece,
  isPieceDisplayed,
  activeSquare,
  handleClick,
}) => {
  const { rank, position, color, highlighted } = piece;

  let newColor: Piece["color"] = color;
  if (highlighted == true) {
    newColor = "yellow";
  }

  let renderedColor;
  switch (newColor) {
    case "red":
      renderedColor = "#E53E3E";
      break;
    case "blue":
      renderedColor = "#3182CE";
      break;
    case "transparent":
      renderedColor = "transparent";
      break;
    case "yellow":
      renderedColor = "#FEFCBF";
  }

  if (!isPieceDisplayed) {
    if (highlighted == true && (color == "red" || color == "blue")) {
      return (
        <Center
          border="1px"
          borderColor="gray.300"
          w="100%"
          onClick={handleClick}
          bg={`${color}.200`}
          color={`${color}.700`}
        >
          <GridItem>
            <Center>
              <BiX size="90%" opacity="100%" />
            </Center>
          </GridItem>
        </Center>
      );
    } else {
      return (
        <Center
          border="1px"
          borderColor="gray.300"
          w="100%"
          onClick={handleClick}
          bg={renderedColor}
          color="white"
        >
          <GridItem></GridItem>
        </Center>
      );
    }
  }

  if (isPieceDisplayed && rank === 99) {
    // your bombs
    return (
      <Center
        border="1px"
        borderColor="gray.300"
        w="100%"
        bg={`${color}.500`}
        color="white"
      >
        <BiBomb size="50%" />
      </Center>
    );
  }

  if (rank == -1) {
    // lakes in the middle
    return (
      <Center
        border="1px"
        borderColor="gray.300"
        w="100%"
        bg="#C4F1F9"
        color="white"
      >
        <BiWater size="50%" />
      </Center>
    );
  }

  if (isPieceDisplayed && rank == 0) {
    // your flag
    return (
      <Center
        border="1px"
        borderColor="gray.300"
        w="100%"
        bg={`${color}.500`}
        color="white"
      >
        <BiFlag size="50%" />
      </Center>
    );
  }

  return (
    <Center
      _hover={{ opacity: 0.5 }}
      onClick={handleClick}
      bg={activeSquare?.position == position ? `${color}.700` : renderedColor}
      color="white"
      border="1px"
      borderColor="gray.300"
    >
      <GridItem fontSize="lg" fontWeight="bold">
        {rank}
      </GridItem>
    </Center>
  );
};

export default Square;
