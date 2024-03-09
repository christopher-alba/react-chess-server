import { Team } from "./types/enums";
import { Game } from "./types/gameTypes";

export let games: Game[] = [];

export const game = (id: string) => games.find((x) => x.gameID === id);

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
}: {
  gameID: string;
  name: string;
  playerID: string;
}) => {
  if (!games.find((x) => x.gameID === gameID)) {
    const color = Math.random() <= 0.5 ? Team.White : Team.Black;
    const player = new Player(name, color, playerID, gameID);
    games.push({
      gameID: gameID,
      players: [player],
    });
    return {
      message: "Joined successfully",
      opponent: null,
      player,
    };
  }

  if (!((games.find((x) => x.gameID === gameID)?.gameID.length ?? -1) >= 2)) {
    return { error: "This game is full" };
  }

  const opponent = games.find((x) => x.gameID)?.players[0];
  const color = opponent?.color === Team.White ? Team.Black : Team.White;
  const player = new Player(name, color, playerID, gameID);
  let players = games.find((x) => x.gameID === gameID)?.players;
  if (players?.find((x) => x.playerID === player.playerID))
    return {
      error: "Player already exists",
      opponent: undefined,
      player: undefined,
    };

  players?.push(player);

  return {
    message: "Added successfully",
    opponent,
    player,
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
