import React, { useState } from "react";
import {
  DndContext,
  DragEndEvent,
  closestCenter,
  useSensor,
  useSensors,
  PointerSensor,
  KeyboardSensor,
  TouchSensor,
} from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  arraySwap,
  rectSwappingStrategy,
  SortableContext,
  useSortable,
  sortableKeyboardCoordinates,
} from "@dnd-kit/sortable";
import createDummyGame from "../helper-functions/createDummyGame";
import { Button, Center, Grid, GridItem, position } from "@chakra-ui/react";
import Piece from "../helper-functions/Piece";
import { BiBomb, BiFlag } from "react-icons/bi";

interface SortableSquareProps {
  id: number;
  gameState: Piece[];
}

interface SetupPageProps {
  gameState: Piece[];
}

const SortableSquare: React.FC<SortableSquareProps> = ({ id, gameState }) => {
  const { rank, color } = gameState[id - 1];

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
    borderColor: "gray.300",
    w: "100%",
  };

  if (gameState[id - 1].rank == 0) {
    return (
      <Center
        {...SquareTemplateProps}
        bg={isDragging ? "blackAlpha.700" : `${color}.500`}
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
        bg={isDragging ? "blackAlpha.700" : `${color}.500`}
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
      bg={isDragging ? "blackAlpha.700" : `${color}.500`}
      sx={{ touchAction: "none" }}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <GridItem fontSize="lg" fontWeight="bold" color="white">
        {gameState[id - 1].rank}
      </GridItem>
    </Center>
  );
};

const SetupPage: React.FC<SetupPageProps> = ({ gameState }) => {
  const [curOrder, setCurOrder] = useState([
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  ]);
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

  const handleClickSaveState = () => {
    console.log(curOrder);
    console.log(
      curOrder.map((position, index) => {
        return { ...gameState[position - 1], position: index };
      })
    );
  };

  return (
    <>
      <DndContext
        onDragEnd={handleDragEnd}
        sensors={sensors}
        collisionDetection={closestCenter}
      >
        <SortableContext items={curOrder} strategy={rectSwappingStrategy}>
          <Grid
            h={["100vw", "90vw", "80vw", "75vw", "50vw", "40vw"]}
            maxW="100vw"
            templateColumns="repeat(10,1fr)"
            templateRows="repeat(10,1fr)"
            gap="1px"
          >
            {curOrder.map((position) => {
              return (
                <SortableSquare
                  key={position}
                  id={position}
                  gameState={gameState}
                />
              );
            })}
          </Grid>
        </SortableContext>
      </DndContext>
      <Button onClick={handleClickSaveState}> Save State </Button>
    </>
  );
};

export default SetupPage;
