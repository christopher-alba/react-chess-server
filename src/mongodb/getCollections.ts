import { client } from ".";
import dotenv from "dotenv";
dotenv.config();

export const getMatchesCollection = () => {
  const db = client.db(process.env.DB_NAME);
  const collection = db.collection("matches");
  return collection;
};
