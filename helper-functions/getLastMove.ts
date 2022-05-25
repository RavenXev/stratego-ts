/**
 * Given two positions on the board, returns an object with a direction and positions keys.
 * @param start
 * @param end
 */
interface ReturnProps {
  direction: "up" | "down" | "left" | "right" | "";
  positions: number[];
}

function getLastMove(start: number, end: number): ReturnProps {
  let returnObject: ReturnProps = { direction: "", positions: [] };
  let currentPosition = start;
  if (start % 10 == end % 10) {
    // same column, check for up and down
    if (end > start) {
      //down
      returnObject["direction"] = "down";
      while (currentPosition < end) {
        returnObject.positions.push(currentPosition);
        currentPosition += 10;
      }
    } else {
      //up
      returnObject["direction"] = "up";
      while (currentPosition > end) {
        returnObject.positions.push(currentPosition);
        currentPosition -= 10;
      }
    }
  } else {
    //same row, check for right and left
    if (end > start) {
      //right
      returnObject["direction"] = "right";
      while (currentPosition < end) {
        returnObject.positions.push(currentPosition);
        currentPosition++;
      }
    } else {
      //left
      returnObject["direction"] = "left";
      while (currentPosition > end) {
        returnObject.positions.push(currentPosition);
        currentPosition--;
      }
    }
  }

  return returnObject;
}

export default getLastMove;
