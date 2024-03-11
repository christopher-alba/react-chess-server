export enum Type {
  Pawn = "PAWN",
  King = "KING",
  Queen = "QUEEN",
  Rook = "ROOK",
  Knight = "KNIGHT",
  Bishop = "BISHOP",
}

export enum Team {
  Black = "BLACK",
  White = "WHITE",
  BlackPromotion = "BLACK PROMOTION",
  WhitePromotion = "WHITE PROMOTION",
  None = "NONE",
}

export enum Mode {
  TwoPlayer,
  FourPlayer,
}

export enum GameState {
  Ongoing = "ONGOING",
  Draw = "DRAW",
  WinnerDecided = "WIN",
  Stopped = "STOPPED",
}

export enum TileColor {
  Light,
  Dark,
}

export enum CheckType {
  None = "NONE",
  Check = "CHECK",
  Checkmate = "CHECKMATE",
}

export enum MoveType {
  AttackPath,
  CheckPath,
  DefaultMove,
}
export enum MoveConsequence {
  Check = "Check",
  Checkmate = "Checkmate",
  Capture = "Capture",
  Default = "Default",
  Draw = "Draw",
  CaptureAndCheck = "CaptureAndCheck",
  CaptureAndCheckmate = "CaptureAndCheckmate",
  CaptureAndDraw = "CaptureAndDraw",
  PromotionAndCheckmate = "PromotionAndCheckmate",
  PromotionAndCheck = "PromotionAndCheck",
  PromotionAndDraw = "PromotionAndDraw",
  Promotion = "Promotion",
}
export enum MoveDirection {
  Up,
  Down,
  Left,
  Right,
  UpperLeft,
  UpperRight,
  BottomLeft,
  BottomRight,
  OneOff,
}

export enum ValidationType {
  CheckDetector,
  Default,
  Enemy,
}

export enum Visibility {
  Public = "Public",
  Auto = "Auto",
  Private = "Private",
}