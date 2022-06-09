import Piece from "../helper-functions/Piece";
import { Center, GridItem, useColorModeValue } from "@chakra-ui/react";
import {
  BiBomb,
  BiWater,
  BiFlag,
  BiX,
  BiChevronDown,
  BiChevronRight,
  BiChevronUp,
  BiChevronLeft,
} from "react-icons/bi";
import { FiXSquare } from "react-icons/fi";
import { ReturnLastMovesProps } from "../helper-functions/getLastMove";
interface SquareProps {
  piece: Piece;
  isPieceDisplayed: boolean;
  activeSquare?: Piece;
  lastActivePiece?: Piece;
  lastMoves: ReturnLastMovesProps;
  wasLastMoveAttack: boolean;
  whoseTurn: "red" | "blue";
  handleClick?: () => void;
  isBlue: boolean;
}

const Square: React.FC<SquareProps> = ({
  piece,
  isPieceDisplayed,
  lastActivePiece,
  wasLastMoveAttack,
  whoseTurn,
  lastMoves,
  activeSquare,
  handleClick,
  isBlue,
}) => {
  const squareBorder = useColorModeValue("gray.300", "gray.700");
  let { rank, position, color, highlighted } = piece;
  const lastMoveColor = whoseTurn == "red" ? "blue" : "red";

  const SquareTemplateProps = {
    border: "1px",
    borderColor: squareBorder,
    w: "100%",
  };

  if (rank == -1) {
    // lakes in the middle
    return (
      <Center {...SquareTemplateProps} bg="#76E4F7" color="white">
        <BiWater size="50%" />
      </Center>
    );
  }
  if (
    lastMoves.positions != null &&
    lastMoves.positions.includes(position) &&
    highlighted == false
  ) {
    // the arrow path of the last move

    let arrowDirection = lastMoves.direction;

    if (isBlue == true) {
      switch (arrowDirection) {
        case "up":
          arrowDirection = "down";
          break;
        case "down":
          arrowDirection = "up";
          break;
        case "right":
          arrowDirection = "left";
          break;
        case "left":
          arrowDirection = "right";
          break;
      }
    }
    switch (arrowDirection) {
      case "up":
        return (
          <Center
            {...SquareTemplateProps}
            bg={color}
            color={`${lastMoveColor}.600`}
          >
            <BiChevronUp size="90%" />
          </Center>
        );
      case "down":
        return (
          <Center
            {...SquareTemplateProps}
            bg={color}
            color={`${lastMoveColor}.600`}
          >
            <BiChevronDown size="90%" />
          </Center>
        );
      case "right":
        return (
          <Center
            {...SquareTemplateProps}
            bg={color}
            color={`${lastMoveColor}.600`}
          >
            <BiChevronRight size="90%" />
          </Center>
        );
      case "left":
        return (
          <Center
            {...SquareTemplateProps}
            bg={color}
            color={`${lastMoveColor}.600`}
          >
            <BiChevronLeft size="90%" />
          </Center>
        );
    }
  }

  if (
    position == lastActivePiece?.position &&
    highlighted == false &&
    (isPieceDisplayed == false || color == "transparent") &&
    wasLastMoveAttack == true
  ) {
    // last piece that moved

    return (
      <Center
        {...SquareTemplateProps}
        bg={`${color}.500`}
        color={color == "transparent" ? "gray.600" : "white"}
      >
        <FiXSquare size="60%" />
      </Center>
    );
  }

  if (!isPieceDisplayed) {
    if (highlighted == true && (color == "red" || color == "blue")) {
      // highlighted enemy piece
      return (
        <Center
          {...SquareTemplateProps}
          _hover={{ opacity: 0.5 }}
          onClick={handleClick}
          bg={`${color}.200`}
          color={`${color}.700`}
        >
          <BiX size="80%" />
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
  } else if (isPieceDisplayed && highlighted == false && rank == null) {
    return (
      <Center {...SquareTemplateProps} bg={"transparent"}>
        <GridItem fontSize="lg" fontWeight="bold"></GridItem>
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
