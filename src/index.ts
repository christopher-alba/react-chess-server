import http from "http";
import { Server } from "socket.io";
import express from "express";
import cors from "cors";
import {
  Player,
  addPlayer,
  addSpectator,
  deleteEmptyGameLobby,
  game,
  games,
  getGames,
  removePlayer,
  removeSpectator,
} from "./game";
import { AllGameStates, AllGamesStates } from "./types/gameTypes";
import { Mode, Team, Visibility } from "./types/enums";
import { jwtCheck } from "./auth";
import { connectToMongoDb } from "./mongodb";
import matchesRoutes from "./routes/matches";

import dotenv from "dotenv";

dotenv.config();

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
app.use(express.json());

app.use("/matches", matchesRoutes);

connectToMongoDb().catch(console.dir);

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

      const {
        error,
        player,
        game: gameObject,
      } = addPlayer({
        name,
        playerID: socket.id,
        visibility,
        password: password,
      });
      if (error) {
        return callback({ error });
      }
      socket.join([gameObject.gameID]);
      console.log(games);

      if (!player) return callback("Player is empty");

      console.log(password);

      callback({
        game: gameObject,
        player: player,
      });

      //retrigger client lobby fetching
      socket.to("mainLobby").emit("lobbyModified");
      console.log("EMITTED MODIFIED");

      // Tell ?2 that player1 has joined the game.
      socket.broadcast.to(player?.gameID).emit("opponentJoin", {
        message: `${player?.name} has joined the game. `,
        opponent: player,
      });

      if ((game(gameObject.gameID)?.players?.length ?? -1) >= 2) {
        const white = game(gameObject.gameID)?.players.find(
          (player: Player) => player.color === Team.White
        );
        io.to(gameObject.gameID).emit("message", {
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
      const {
        error,
        player,
        game: gameObject,
      } = addPlayer({
        name,
        playerID: socket.id,
        gameID,
        password,
      });
      if (error) {
        console.log(error);
        return callback({ error });
      }

      gameObject.players?.push(player);
      socket.join([gameObject.gameID]);
      console.log(games);
      callback({ player: player, game: gameObject });
      socket.to(gameObject.gameID).emit("opponentJoin", { player: player });
    }
  );

  socket.on(
    "joinAsSpectator",
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
      const { error, game, newSpectator } = addSpectator(
        name,
        socket.id,
        gameID,
        password
      );
      if (error) {
        console.log(error);
        return callback({ error });
      }

      game.spectators?.push(newSpectator);
      socket.join([gameID]);
      console.log(gameID);
      console.log(games);
      callback({ newSpectator: newSpectator, game: game });
      socket.to(gameID).emit("spectatorJoin", { spectator: newSpectator });
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
    const playerResponse = removePlayer(socket.id);
    const response = removeSpectator(socket.id);

    if (playerResponse || response) {
      if (playerResponse) {
        console.log("broadcasting player left");
        if (
          playerResponse.type === "SPECTATOR" &&
          playerResponse.player !== undefined
        ) {
          socket.broadcast.to(playerResponse.player.gameID).emit("playerLeft", {
            remainingPlayer: undefined,
          });
        } else {
          socket.broadcast.to(playerResponse.player.gameID).emit("playerLeft", {
            remainingPlayer: playerResponse.player,
          });
        }
      } else if (response) {
        //if spectators exist use their game id to send message
        if (response.spectators?.length > 0) {
          socket.broadcast
            .to(response.spectators[0].gameID)
            .emit("spectatorLeft", { spectators: response.spectators });
        } else if (response.players?.length > 0) {
          //if spectators dont exist, use player ids to send message
          io.to(response.players[0].gameID).emit("message", {
            message: `${response.players[0].name} has left the game.`,
          });
          socket.broadcast
            .to(response.players[0].gameID)
            .emit("spectatorLeft", { spectators: response.spectators });
        }
      }
    }
    deleteEmptyGameLobby();
    socket.join("mainLobby");
    socket.to("mainLobby").emit("lobbyModified");
  });
});
