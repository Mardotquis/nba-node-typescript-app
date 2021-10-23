import axios from "axios";
import { gameDetail } from "./types";
import log from "./log";

const BASE_GAME_URL =
  "https://data.nba.com/data/10s/v2015/json/mobile_teams/nba/2020/scores";

const gameAPI = axios.create({
  baseURL: BASE_GAME_URL,
});

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
