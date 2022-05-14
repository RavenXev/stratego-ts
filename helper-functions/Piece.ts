export default interface Piece {
  rank: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 99 | -1 | null;
  position: number;
  color: "red" | "blue" | undefined;
  handleClick?: React.MouseEventHandler<HTMLDivElement>;
}
