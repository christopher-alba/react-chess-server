import { getMatchesCollection } from "../getCollections";

export const getMatch = async (gameId: string, auth0UserId: string) => {
  const matchCollection = getMatchesCollection();
  const query = { gameId, auth0UserId };
  const match = await matchCollection.findOne(query);
  return match;
};

export const getMatches = async (auth0UserId: string) => {
  const matchCollection = getMatchesCollection();
  const query = { auth0UserId };
  const matches = await matchCollection.find(query).toArray();
  return matches;
};

export const createMatch = async (match) => {
  //set dateTime for match
  const matchWithDT = {
    ...match,
    modifiedOn: Date.now(),
  };
  const matchCollection = getMatchesCollection();
  console.log(match);
  //check if match already exists
  const query = { auth0UserId: match.auth0UserId, gameId: match.gameId };
  const foundMatch = await matchCollection.findOne(query);
  if (foundMatch) {
    //if match exists, update the existing match
    const result = await matchCollection.findOneAndReplace(query, matchWithDT);
    return result;
  } else {
    //else, create a new match
    const result = await matchCollection.insertOne(matchWithDT);
    return result;
  }
};
