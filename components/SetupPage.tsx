import React, { useState } from "react";
import { DndContext, DragEndEvent, closestCenter } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  arraySwap,
  rectSwappingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import createDummyGame from "../helper-functions/createDummyGame";
import { Grid, GridItem } from "@chakra-ui/react";

let dummyGame = createDummyGame().map((piece) => {
  return { ...piece, id: piece.position + 1 };
});

interface SortableSquareProps {
  id: number;
}

const SortableSquare: React.FC<SortableSquareProps> = ({ id }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <GridItem
      border="1px"
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      {id}
    </GridItem>
  );
};

const SetupPage = () => {
  const [curOrder, setCurOrder] = useState(dummyGame);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (over != null && active.id !== over.id) {
      setCurOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);

        return arraySwap(items, oldIndex, newIndex);
      });
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
      <SortableContext items={curOrder} strategy={rectSwappingStrategy}>
        <Grid
          h={["100vw", "90vw", "80vw", "75vw", "50vw", "40vw"]}
          maxW="100vw"
          templateColumns="repeat(10,1fr)"
          templateRows="repeat(10,1fr)"
          gap="1px"
        >
          {curOrder.map((piece) => {
            return <SortableSquare key={piece.position} id={piece.id} />;
          })}
        </Grid>
      </SortableContext>
    </DndContext>
  );
};

export default SetupPage;
