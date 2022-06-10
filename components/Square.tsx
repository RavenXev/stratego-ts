import Piece from "../helper-functions/Piece";
import {
  Center,
  GridItem,
  useColorModeValue,
  useColorMode,
} from "@chakra-ui/react";
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
  const lakeBackground = useColorModeValue("gray.400", "gray.500");
  const squareBorder = useColorModeValue("gray.300", "gray.700");
  const modeBlue = useColorModeValue("blue.500", "blue.700");
  const modeRed = useColorModeValue("red.600", "red.700");
  const modeYellow = useColorModeValue("yellow.300", "yellow.400");
  const { colorMode } = useColorMode();
  let { rank, position, color, highlighted } = piece;
  const lastMoveColor = whoseTurn == "red" ? "blue" : "red";

  function renderedColor(color: "transparent" | "blue" | "red" | "yellow") {
    switch (color) {
      case "transparent":
        return "transparent";
      case "yellow":
        return;
      case "blue":
        return modeBlue;
      case "red":
        return modeRed;
    }
  }

  const SquareTemplateProps = {
    border: "1px",
    borderColor: squareBorder,
    w: "100%",
  };

  // lakes in the middle
  if (rank == -1) {
    return (
      <Center {...SquareTemplateProps} bg={lakeBackground} color="gray.100">
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
          <Center {...SquareTemplateProps} color={renderedColor(lastMoveColor)}>
            <BiChevronUp size="90%" />
          </Center>
        );
      case "down":
        return (
          <Center {...SquareTemplateProps} color={renderedColor(lastMoveColor)}>
            <BiChevronDown size="90%" />
          </Center>
        );
      case "right":
        return (
          <Center {...SquareTemplateProps} color={renderedColor(lastMoveColor)}>
            <BiChevronRight size="90%" />
          </Center>
        );
      case "left":
        return (
          <Center {...SquareTemplateProps} color={renderedColor(lastMoveColor)}>
            <BiChevronLeft size="90%" />
          </Center>
        );
    }
  }

  // last piece that moved (x with box)
  if (
    position == lastActivePiece?.position &&
    highlighted == false &&
    (isPieceDisplayed == false || color == "transparent") &&
    wasLastMoveAttack == true
  ) {
    return (
      <Center
        {...SquareTemplateProps}
        bg={renderedColor(color)}
        color={
          colorMode == "light"
            ? color == "transparent"
              ? "gray.600"
              : "gray.100"
            : "gray.100"
        }
      >
        <FiXSquare size="60%" />
      </Center>
    );
  }

  if (!isPieceDisplayed) {
    // highlighted enemy piece
    if (highlighted == true && (color == "red" || color == "blue")) {
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
    }

    // enemy piece
    else {
      return (
        <Center {...SquareTemplateProps} bg={renderedColor(color)}>
          <GridItem></GridItem>
        </Center>
      );
    }
  }

  // your bombs
  else if (isPieceDisplayed && rank === 99) {
    return (
      <Center
        {...SquareTemplateProps}
        bg={renderedColor(color)}
        color="gray.100"
      >
        <BiBomb size="50%" />
      </Center>
    );
  }

  // your flag
  else if (isPieceDisplayed && rank == 0) {
    return (
      <Center
        {...SquareTemplateProps}
        bg={renderedColor(color)}
        color="gray.100"
      >
        <BiFlag size="50%" />
      </Center>
    );

    //blank square
  } else if (isPieceDisplayed && highlighted == false && rank == null) {
    return (
      <Center {...SquareTemplateProps}>
        <GridItem></GridItem>
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
          ? colorMode == "light"
            ? `${color}.700`
            : `${color}.600`
          : highlighted == true
          ? modeYellow // yellow highlight
          : renderedColor(color)
      }
      color="gray.100"
    >
      <GridItem fontSize="lg" fontWeight="bold">
        {rank}
      </GridItem>
    </Center>
  );
};

export default Square;
