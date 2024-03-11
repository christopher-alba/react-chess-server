import http from "http";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import {
  Player,
  addPlayer,
  deleteEmptyGameLobby,
  game,
  games,
  getGames,
  removePlayer,
} from "./game";
import { AllGameStates, AllGamesStates } from "./types/gameTypes";
import { Mode, Team, Visibility } from "./types/enums";

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT ?? 5000;

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
server.listen(PORT, () => console.log("Server running on port " + PORT));

io.on("connection", (socket) => {
  socket.on("getLobbies", ({ gameMode }: { gameMode: Mode }, callback) => {
    socket.join("mainLobby");
    callback({ lobbies: getGames(gameMode) });
  });
  socket.on(
    "create",
    (
      {
        name,
        visibility,
        password,
      }: { name: string; visibility: Visibility; password: string },
      callback
    ) => {
      console.log("Attempting to create game.");

      const { error, player, state, gameID } = addPlayer({
        name,
        playerID: socket.id,
        visibility,
        password: password,
      });
      if (error) {
        return callback({ error });
      }
      socket.join([gameID]);
      console.log(games);

      if (!player) return callback("Player is empty");

      console.log(password);

      callback({ color: player?.color, state: state, password: password });

      //retrigger client lobby fetching
      socket.to("mainLobby").emit("lobbyModified");
      console.log("EMITTED MODIFIED");

      // Tell ?2 that player1 has joined the game.
      socket.broadcast.to(player?.gameID).emit("opponentJoin", {
        message: `${player?.name} has joined the game. `,
        opponent: player,
      });

      if ((game(gameID)?.players?.length ?? -1) >= 2) {
        const white = game(gameID)?.players.find(
          (player: Player) => player.color === Team.White
        );
        io.to(gameID).emit("message", {
          message: `Let's start the game. White (${white?.name}) goes first`,
        });
      }
    }
  );

  socket.on(
    "join",
    (
      {
        name,
        gameID,
        password,
      }: { name: string; gameID: string; password?: string },
      callback
    ) => {
      console.log("Attempting to join game:" + gameID);
      console.log("password:" + password);

      if (!games.find((game) => game.gameID === gameID)) return;
      const { error, player, players, opponent, state } = addPlayer({
        name,
        playerID: socket.id,
        gameID,
        password,
      });
      if (error) {
        console.log(error);
        return callback({ error });
      }

      players?.push(player);
      console.log(players);
      socket.join([gameID]);
      console.log(gameID);
      console.log(games);
      callback({ color: player?.color, state: state });
    }
  );

  socket.on(
    "move",
    (props: { allGamesStates: AllGamesStates; gameID: string }) => {
      console.log("Someone has moved");

      socket.broadcast
        .to(props.gameID)
        .emit("opponentMove", { allGamesStates: props.allGamesStates });
      let state = games.find((x) => x.gameID === props.gameID);
      if (!state) return;
      state.allGamesStates = props.allGamesStates;
      console.log(state);
    }
  );

  socket.on("disconnect", () => {
    const player = removePlayer(socket.id);

    if (player) {
      io.to(player.gameID).emit("message", {
        message: `${player.name} has left the game.`,
      });
      socket.broadcast.to(player.gameID).emit("opponentLeft");
      console.log(games);
      deleteEmptyGameLobby();
      socket.join("mainLobby");
      socket.to("mainLobby").emit("lobbyModified");
    }
  });
});
