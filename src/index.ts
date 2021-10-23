import axios from "axios";
import { gameDetail } from "./types";
import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";

const GAME_URL =
  "https://data.nba.com/data/10s/v2015/json/mobile_teams/nba/2020/scores";

const gameAPI = axios.create({
  baseURL: GAME_URL,
});

const getGameID = (): number | null => {
  const args = process.argv.slice(2);
  console.log("🚀 ~ file: index.ts ~ line 31 ~ init ~ args", args);
  if (!args.length) {
    console.log("no args provided");
    return;
  }
  const gameId = args.find((arg) => {});
};

const getGameDetails = async (gameId: number): Promise<gameDetail | null> => {
  if (!gameId) {
    console.log("no gameId provided");
    return;
  }

  try {
    const response = await gameAPI.get(`/gamedetail/${gameId}_gamedetail.json`);
    console.log(
      "🚀 ~ file: index.ts ~ line 21 ~ getGameDetails ~ response",
      response
    );
  } catch (error) {}
};

const init = async () => {
  // const argv = yargs(hideBin(process.argv)).argv;
  // const gameId = argv.gameId;
  // const gameDetails = await getGameDetails(gameId);
};

init();
