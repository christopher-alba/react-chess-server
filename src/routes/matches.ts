import express from "express";
import { jwtCheck, userIdEqualsJwtSub } from "../auth";
import { client } from "../mongodb";
import dotenv from "dotenv";
import { createMatch, getMatch, getMatches } from "../mongodb/db/matches";

dotenv.config();

const router = express.Router();

//      ./matches/
router.get(
  "/:gameId/:auth0UserId",
  /*jwtCheck,*/ async (req, res) => {
    try {
      const match = await getMatch(req.params.gameId, req.params.auth0UserId);
      res.send(match).status(200);
    } catch (err) {
      res.send(err).status(500);
    }
  }
);

router.get("/:auth0UserId", jwtCheck, async (req, res) => {
  try {
    const token = req.headers.authorization;
    userIdEqualsJwtSub(req.params.auth0UserId, token);
    const match = await getMatches(req.params.auth0UserId);
    res.send(match).status(200);
  } catch (err) {
    res.send(err).status(500);
  }
});

router.post("/create", jwtCheck, async (req, res) => {
  try {
    const token = req.headers.authorization;
    userIdEqualsJwtSub(req.body.auth0UserId, token);
    const result = await createMatch(req.body);
    res.send(result).status(200);
  } catch (err) {
    res.send(err).status(500);
  }
});

export default router;
