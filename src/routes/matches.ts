import express from "express";
import { jwtCheck, userIdEqualsJwtSub } from "../auth";
import { client } from "../mongodb";
import dotenv from "dotenv";
import {
  createMatch,
  deleteMatch,
  getMatch,
  getMatches,
} from "../mongodb/db/matches";

dotenv.config();

const router = express.Router();

//      ./matches/
router.get(
  "/:gameId/:auth0UserId",
  /*jwtCheck,*/ async (req, res) => {
    try {
      const match = await getMatch(req.params.gameId, req.params.auth0UserId);
      res.status(200).send(match);
    } catch (err) {
      res.status(500).send(err);
    }
  }
);

router.get("/:auth0UserId", jwtCheck, async (req, res) => {
  try {
    const token = req.headers.authorization;
    userIdEqualsJwtSub(req.params.auth0UserId, token);
    const match = await getMatches(req.params.auth0UserId);
    res.status(200).send(match);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.post("/create", jwtCheck, async (req, res) => {
  try {
    const token = req.headers.authorization;
    userIdEqualsJwtSub(req.body.auth0UserId, token);
    const result = await createMatch(req.body);
    res.send(result).status(200);
  } catch (err) {
    res.status(500).send(err);
  }
});

router.delete("/:auth0UserId/:matchId", jwtCheck, async (req, res) => {
  try {
    const token = req.headers.authorization;
    userIdEqualsJwtSub(req.params.auth0UserId, token);
    await deleteMatch(req.params.matchId);
    res.status(200).send();
  } catch (err) {
    res.status(500).send(err);
  }
});

export default router;
