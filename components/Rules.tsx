import {
  Box,
  Button,
  Heading,
  List,
  ListIcon,
  ListItem,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { BiBomb, BiFlag } from "react-icons/bi";

export const Rules = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen} variant="ghost" colorScheme="gray" size="lg">
        Rules
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent p={6}>
          <ModalHeader> Stratejist Rules </ModalHeader>
          <ModalCloseButton />

          <ModalBody>
            <Text>
              Stratejist is a game of secrecy and strategy. The goal of the game
              is to capture the opponents flag. Any piece can capture the flag.
              Pieces can move one square up, down, left, or right. When
              attacking a piece, the higher number will capture the smaller
              number. If it is a tie, both pieces are removed from the board.
            </Text>
            <br />
            <Heading size="xs" mb={3}>
              Special Pieces:{" "}
            </Heading>
            <List spacing={3}>
              <ListItem>
                <ListIcon as={BiFlag} />
                Flag: Cannot move. If your flag is captured, you lose the game.
              </ListItem>
              <ListItem>
                <ListIcon as={BiBomb} />
                Bomb: Cannot move. Any piece (other than a 3) that tries to
                attack a bomb will fail.
              </ListItem>
              <ListItem>
                <strong>1</strong> Spy (1): The spy can win against your
                opponent's 10 piece ONLY if it attacks the 10 first.
              </ListItem>
              <ListItem>
                <strong>2</strong> Scout (2): Scouts can move in any direction
                for any distance, like a rook in chess.
              </ListItem>
              <ListItem>
                <strong>3</strong> Miner (3). Miners are able to successfully
                remove a bomb piece from the board.
              </ListItem>
            </List>
            <br />
            Tips: Put your flag in the back and surround it with bombs. Protect
            your miners to ensure you can get to your opponents flag.
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
