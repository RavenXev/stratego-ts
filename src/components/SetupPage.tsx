import React, { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  arraySwap,
  rectSwappingStrategy,
  SortableContext,
  useSortable,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import {
  Alert,
  AlertIcon,
  AlertTitle,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  Spinner,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Piece from "../helper-functions/Piece";
import { BiBomb, BiFlag } from "react-icons/bi";
import { MdContentCopy } from "react-icons/md";
import { dbGameProps } from "../components/Game";
import { useNavigate } from "react-router-dom";

interface SortableSquareProps {
  id: number;
  gameState: Piece[];
}

interface SetupPageProps {
  dbGame: dbGameProps;
  userId: string;
  gameId: string;
  saveState: (dbGame: dbGameProps) => void;
}

const SortableSquare: React.FC<SortableSquareProps> = ({ id, gameState }) => {
  const { rank, color } = gameState[id - 1];
  const squareBorder = useColorModeValue("gray.300", "gray.700");
  const modeBlue = useColorModeValue("blue.500", "blue.700");
  const modeRed = useColorModeValue("red.600", "red.700");
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

  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const SquareTemplateProps = {
    border: "1px",
    borderColor: squareBorder,
    w: "100%",
  };

  if (gameState[id - 1].rank == 0) {
    return (
      <Center
        {...SquareTemplateProps}
        bg={isDragging ? "blackAlpha.700" : renderedColor(color)}
        sx={{ touchAction: "none" }}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        color="white"
      >
        <BiFlag size="50%" />
      </Center>
    );
  } else if (gameState[id - 1].rank == 99) {
    return (
      <Center
        {...SquareTemplateProps}
        bg={isDragging ? "blackAlpha.700" : renderedColor(color)}
        sx={{ touchAction: "none" }}
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        color="white"
      >
        <BiBomb size="50%" />
      </Center>
    );
  }

  return (
    <Center
      {...SquareTemplateProps}
      bg={isDragging ? "blackAlpha.700" : renderedColor(color)}
      sx={{ touchAction: "none" }}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <GridItem fontSize="lg" fontWeight="bold" color="white">
        {rank}
      </GridItem>
    </Center>
  );
};

const SetupPage: React.FC<SetupPageProps> = ({
  dbGame,
  userId,
  saveState,
  gameId,
}) => {
  let defaultArray: number[] = [];
  if (dbGame.red == userId) {
    defaultArray = [
      61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78,
      79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96,
      97, 98, 99, 100,
    ];
  }
  if (dbGame.blue == userId) {
    defaultArray = [
      1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
      22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39,
      40,
    ];
  }

  const [curOrder, setCurOrder] = useState<number[]>(defaultArray);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over != null && active.id !== over.id) {
      setCurOrder((items) => {
        const oldIndex = items.indexOf(Number(active.id));
        const newIndex = items.indexOf(Number(over.id));
        return arraySwap(items, oldIndex, newIndex);
      });
    }
  }

  const WaitMessageComponent = () => {
    let navigate = useNavigate();
    if (
      (dbGame.red == userId && dbGame.blue == "") ||
      (dbGame.blue == userId && dbGame.red == "")
    ) {
      return (
        <>
          <Spinner thickness="4px" size="lg" speed="1s" mt={3} mb={6} />
          <AlertTitle fontSize="lg" mb={2}>
            Waiting for opponent to join...
          </AlertTitle>
          <Text> Click and drag to swap pieces and arrange your army.</Text>
        </>
      );
    } else if (
      (dbGame.red == userId && dbGame.isBlueReady == false) ||
      (dbGame.blue == userId && dbGame.isRedReady == false)
    ) {
      return (
        <>
          <Spinner
            color="green.500"
            thickness="4px"
            size="lg"
            speed="1s"
            mt={3}
            mb={6}
          />

          <AlertTitle fontSize="lg" mb={2}>
            Your opponent is setting up their pieces!
          </AlertTitle>
          <Text> Click and drag to swap pieces and arrange your army.</Text>
        </>
      );
    } else if (
      (dbGame.isRedReady == true && dbGame.blue == userId) ||
      (dbGame.isBlueReady == true && dbGame.red == userId)
    ) {
      return (
        <>
          {(dbGame.isRedReady == true && dbGame.blue == userId) ||
          (dbGame.isBlueReady == true && dbGame.red == userId) ? (
            <AlertIcon boxSize="2em" mt={3} mb={6} />
          ) : (
            <Spinner thickness="4px" size="lg" speed="1s" mt={3} mb={6} />
          )}

          <AlertTitle fontSize="lg" mb={2}>
            Your opponent is ready!
          </AlertTitle>
          <Text> Click and drag to swap pieces and arrange your army.</Text>
        </>
      );
    }

    return (
      <>
        <AlertTitle>An error has occurred</AlertTitle>{" "}
        <Button
          colorScheme="red"
          mb={6}
          onClick={() => {
            navigate(`/`);
          }}
        >
          Back to home
        </Button>
        ;
      </>
    );
  };

  const handleClickSaveState = () => {
    let newGame = { ...dbGame };

    if (dbGame.red == userId) {
      const newState = curOrder.map((position, index) => {
        return { ...dbGame.gameState[position - 1], position: index + 60 };
      });

      newGame.setups.red = newState;
      newGame.isRedReady = true;
    }

    if (dbGame.blue == userId) {
      const newState = curOrder
        .map((position, index) => {
          return { ...dbGame.gameState[position - 1], position: 39 - index };
        })
        .reverse();

      newGame.setups.blue = newState;
      newGame.isBlueReady = true;
    }

    saveState(newGame);
  };

  return (
    <>
      {(dbGame.red == "" || dbGame.blue == "") && (
        <Alert>
          <Flex
            alignItems="center"
            justifyContent="center"
            flexWrap="wrap"
            padding={2}
            minH={6}
          >
            <AlertIcon mt={2} mb={2} />
            Copy the game code here to send to your friend!
            <Button
              size="sm"
              mt={2}
              mb={2}
              variant="outline"
              colorScheme="blue"
              aria-label="copy game code"
              rightIcon={<MdContentCopy />}
              ml={3}
              onClick={() => {
                navigator.clipboard.writeText(`${gameId}`);
              }}
            >
              {gameId}
            </Button>
          </Flex>
        </Alert>
      )}

      <DndContext
        onDragEnd={handleDragEnd}
        sensors={sensors}
        collisionDetection={closestCenter}
      >
        <SortableContext items={curOrder} strategy={rectSwappingStrategy}>
          <Grid
            maxW="100vw"
            templateColumns="repeat(10,1fr)"
            templateRows="repeat(6,1fr)"
            gap="1px"
          >
            <GridItem rowSpan={2} colSpan={10}>
              <Alert
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                textAlign="center"
                height="100%"
                status="success"
              >
                <WaitMessageComponent />
              </Alert>
            </GridItem>

            {curOrder.map((position) => {
              return (
                <SortableSquare
                  key={position}
                  id={position}
                  gameState={dbGame.gameState}
                />
              );
            })}
          </Grid>
        </SortableContext>
      </DndContext>
      <Button onClick={handleClickSaveState} colorScheme="whatsapp" size="lg">
        {(dbGame.red == userId && dbGame.isRedReady) ||
        (dbGame.blue == userId && dbGame.isBlueReady)
          ? "Update Formation"
          : "Ready!"}
      </Button>
    </>
  );
};

export default SetupPage;
