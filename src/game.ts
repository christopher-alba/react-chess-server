import { mapCoordinatesToChessNotation } from "./helper";
import {
  CheckType,
  GameState,
  Mode,
  Team,
  TileColor,
  Type,
  Visibility,
} from "./types/enums";
import {
  AllGameStates,
  AllGamesStates,
  Game,
  StatesOfPieces,
  Tiles,
} from "./types/gameTypes";

export let games: Game[] = [];

const initialize2PlayerBoardTiles = (): Tiles => {
  let tilesArray: Tiles = [];
  for (let y = 0; y < 8; y++) {
    let color = y % 2 === 0 ? TileColor.Light : TileColor.Dark;
    for (let x = 0; x < 8; x++) {
      tilesArray.push({
        position: {
          x: x,
          y: y,
        },
        chessNotationPosition: mapCoordinatesToChessNotation(x, y),
        isWall: false,
        color: color,
      });
      color = color === TileColor.Light ? TileColor.Dark : TileColor.Light;
    }
  }
  return tilesArray;
};
const initialize2PlayerBoardPieces = (): StatesOfPieces => {
  let pieces: StatesOfPieces = [];
  // pieces.push({
  //   position: { x: 0, y: 6 },
  //   alive: true,
  //   team: Team.Black,
  //   id: uuidv4(),
  //   type: Type.Pawn,
  //   chessNotationPosition: mapCoordinatesToChessNotation(0, 6),
  // });
  // pieces.push({
  //   position: { x: 5, y: 7},
  //   alive: true,
  //   team: Team.White,
  //   id: uuidv4(),
  //   type: Type.King,
  //   chessNotationPosition: mapCoordinatesToChessNotation(5, 7),
  // });
  // pieces.push({
  //   position: { x: 2, y: 0 },
  //   alive: true,
  //   team: Team.Black,
  //   id: uuidv4(),
  //   type: Type.King,
  // });

  // black pieces
  pieces.push({
    position: { x: 0, y: 0 },
    alive: true,
    team: Team.Black,
    id: crypto.randomUUID(),
    type: Type.Rook,
    chessNotationPosition: mapCoordinatesToChessNotation(0, 0),
  });
  pieces.push({
    position: { x: 1, y: 0 },
    alive: true,
    team: Team.Black,
    id: crypto.randomUUID(),
    type: Type.Knight,
    chessNotationPosition: mapCoordinatesToChessNotation(1, 0),
  });
  pieces.push({
    position: { x: 2, y: 0 },
    alive: true,
    team: Team.Black,
    id: crypto.randomUUID(),
    type: Type.Bishop,
    chessNotationPosition: mapCoordinatesToChessNotation(2, 0),
  });
  pieces.push({
    position: { x: 4, y: 0 },
    alive: true,
    team: Team.Black,
    id: crypto.randomUUID(),
    type: Type.King,
    chessNotationPosition: mapCoordinatesToChessNotation(4, 0),
  });
  pieces.push({
    position: { x: 3, y: 0 },
    alive: true,
    team: Team.Black,
    id: crypto.randomUUID(),
    type: Type.Queen,
    chessNotationPosition: mapCoordinatesToChessNotation(3, 0),
  });
  pieces.push({
    position: { x: 5, y: 0 },
    alive: true,
    team: Team.Black,
    id: crypto.randomUUID(),
    type: Type.Bishop,
    chessNotationPosition: mapCoordinatesToChessNotation(5, 0),
  });
  pieces.push({
    position: { x: 6, y: 0 },
    alive: true,
    team: Team.Black,
    id: crypto.randomUUID(),
    type: Type.Knight,
    chessNotationPosition: mapCoordinatesToChessNotation(6, 0),
  });
  pieces.push({
    position: { x: 7, y: 0 },
    alive: true,
    team: Team.Black,
    id: crypto.randomUUID(),
    type: Type.Rook,
    chessNotationPosition: mapCoordinatesToChessNotation(7, 0),
  });
  for (let x = 0; x < 8; x++) {
    pieces.push({
      position: { x: x, y: 1 },
      alive: true,
      team: Team.Black,
      id: crypto.randomUUID(),
      type: Type.Pawn,
      chessNotationPosition: mapCoordinatesToChessNotation(x, 1),
    });
  }

  //white pieces
  pieces.push({
    position: { x: 0, y: 7 },
    alive: true,
    team: Team.White,
    id: crypto.randomUUID(),
    type: Type.Rook,
    chessNotationPosition: mapCoordinatesToChessNotation(0, 7),
  });
  pieces.push({
    position: { x: 1, y: 7 },
    alive: true,
    team: Team.White,
    id: crypto.randomUUID(),
    type: Type.Knight,
    chessNotationPosition: mapCoordinatesToChessNotation(1, 7),
  });
  pieces.push({
    position: { x: 2, y: 7 },
    alive: true,
    team: Team.White,
    id: crypto.randomUUID(),
    type: Type.Bishop,
    chessNotationPosition: mapCoordinatesToChessNotation(2, 7),
  });
  pieces.push({
    position: { x: 4, y: 7 },
    alive: true,
    team: Team.White,
    id: crypto.randomUUID(),
    type: Type.King,
    chessNotationPosition: mapCoordinatesToChessNotation(4, 7),
  });
  pieces.push({
    position: { x: 3, y: 7 },
    alive: true,
    team: Team.White,
    id: crypto.randomUUID(),
    type: Type.Queen,
    chessNotationPosition: mapCoordinatesToChessNotation(3, 7),
  });
  pieces.push({
    position: { x: 5, y: 7 },
    alive: true,
    team: Team.White,
    id: crypto.randomUUID(),
    type: Type.Bishop,
    chessNotationPosition: mapCoordinatesToChessNotation(5, 7),
  });
  pieces.push({
    position: { x: 6, y: 7 },
    alive: true,
    team: Team.White,
    id: crypto.randomUUID(),
    type: Type.Knight,
    chessNotationPosition: mapCoordinatesToChessNotation(6, 7),
  });
  pieces.push({
    position: { x: 7, y: 7 },
    alive: true,
    team: Team.White,
    id: crypto.randomUUID(),
    type: Type.Rook,
    chessNotationPosition: mapCoordinatesToChessNotation(7, 7),
  });
  for (let x = 0; x < 8; x++) {
    pieces.push({
      position: { x: x, y: 6 },
      alive: true,
      team: Team.White,
      id: crypto.randomUUID(),
      type: Type.Pawn,
      chessNotationPosition: mapCoordinatesToChessNotation(x, 6),
    });
  }
  return pieces;
};

export const game = (id: string) => games.find((x) => x.gameID === id);
export const getGames = (mode: Mode) =>
  games.filter((x) => x.allGamesStates?.gamesStates?.[0]?.mode === mode);
export class Player {
  public name: string;
  public color: Team;
  public playerID: string;
  public gameID: string;

  constructor(name: string, color: Team, playerID: string, gameID: string) {
    this.name = name;
    this.color = color;
    this.playerID = playerID;
    this.gameID = gameID;
  }
}

export const addPlayer = ({
  gameID,
  name,
  playerID,
  visibility,
  password,
}: {
  gameID?: string;
  name: string;
  playerID: string;
  visibility?: Visibility;
  password?: string;
}) => {
  if (!games.find((x) => x.gameID === gameID)) {
    const color = Math.random() <= 0.5 ? Team.White : Team.Black;
    const randomID = crypto.randomUUID();
    const player = new Player(name, color, playerID, randomID);
    const state = {
      gameID: randomID,
      players: [player],
      allGamesStates: {
        gamesStates: [
          {
            gameId: randomID,
            mode: Mode.TwoPlayer,
            currentTeam: Team.White,
            moveHistory: [],
            teamStates: [
              {
                teamName: Team.White,
                alive: true,
                winner: false,
                castlingStates: {
                  KingMoved: false,
                  KingRookMoved: false,
                  QueenRookMoved: false,
                  KingSide: false,
                  QueenSide: false,
                },
                enpassantStates: {
                  alliedEnpassantPawns: [],
                  enemyEnpassantPawns: [],
                },
              },
              {
                teamName: Team.Black,
                alive: true,
                winner: false,
                castlingStates: {
                  KingMoved: false,
                  KingRookMoved: false,
                  QueenRookMoved: false,
                  KingSide: false,
                  QueenSide: false,
                },
                enpassantStates: {
                  alliedEnpassantPawns: [],
                  enemyEnpassantPawns: [],
                },
              },
            ],
            gameState: GameState.Stopped,
            checkStatus: {
              type: CheckType.None,
              teamInCheck: Team.None,
              checkingPieces: undefined,
            },
            availableTiles: initialize2PlayerBoardTiles(),
            statesOfPieces: initialize2PlayerBoardPieces(),
          },
        ],
        currentMovesState: [],
      },
      visibility: visibility,
      password: password,
    };
    games.push(state);
    return {
      message: "Joined successfully",
      opponent: null,
      player,
      state: state.allGamesStates,
      gameID: state.gameID,
    };
  }

  if (!((games.find((x) => x.gameID === gameID)?.gameID.length ?? -1) >= 2)) {
    return { error: "This game is full" };
  }

  const opponent = games.find((x) => x.gameID)?.players[0];
  const color = opponent?.color === Team.White ? Team.Black : Team.White;
  const player = new Player(name, color, playerID, gameID);
  const game = games.find((x) => x.gameID === gameID);

  if (game.password && game.password !== password) {
    return {
      error: "Incorrect Password",
      opponent: undefined,
      player: undefined,
    };
  }

  let players = game?.players;

  if (players?.find((x) => x.playerID === player.playerID)) {
    return {
      error: "Player already exists",
      opponent: undefined,
      player: undefined,
    };
  }

  console.log("ALL STATES: ");
  console.log(game.allGamesStates);

  return {
    message: "Added successfully",
    opponent,
    players,
    player,
    state: game.allGamesStates,
  };
};

export const removePlayer = (playerID: string) => {
  for (let i = 0; i < games.length; i++) {
    const game = games[i];
    let players = games.find((x) => x.gameID === game.gameID)?.players;

    if (!players || players.length === 0) return;
    console.log(playerID);

    const index = players?.findIndex((pl) => pl.playerID === playerID);

    if (index !== -1) {
      let res = players.splice(index, 1)[0];
      return res;
    }
  }
};

export const deleteEmptyGameLobby = () => {
  games = games.filter((x) => x.players.length > 0);
  console.log(games);
};
