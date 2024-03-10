export const mapCoordinatesToChessNotation = (x: number, y: number): string => {
  const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const file = letters[x];
  const rank = (8 - y).toString();
  return `${file}${rank}`;
};
