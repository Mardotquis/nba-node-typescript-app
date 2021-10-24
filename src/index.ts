import { IGameDetail } from "./types";
import argv from "./argv";
import axios from "axios";
import log from "./log";

log.debug(argv, "game-cli starting with the following args...");

const BASE_GAME_URL =
  "https://data.nba.com/data/10s/v2015/json/mobile_teams/nba/2020/scores";

const gameAPI = axios.create({
  baseURL: BASE_GAME_URL,
});

gameAPI.interceptors.response.use(
  (response) => {
    log.debug(`gameAPI: call made to ${response?.config?.url}`);

    return response;
  },
  (responseError) => {
    log.debug(responseError, `Error intercepted inside gameAPI.`);

    return responseError;
  }
);

const getGameID = (): string | null => {
  if (!argv.gameId) {
    log.error("No gameId provided. Please provide a string.");
    return null;
  }

  return argv.gameId;
};

const getGameDetails = async (gameId: string): Promise<IGameDetail | null> => {
  try {
    const response = await gameAPI.get<IGameDetail>(
      `/gamedetail/${gameId}_gamedetail.json`
    );

    log.debug(response.data, `Game details response.`);
    log.info(`Successfully fetched game details for ${gameId}!`);

    return response.data;
  } catch (error) {
    log.error(error, "Error while fetching game details.");
    // throw?
  }
};

const init = async () => {
  const gameId = getGameID();
  console.log("🚀 ~ file: index.ts ~ line 45 ~ init ~ gameId", gameId);

  if (!gameId) {
    log.fatal("No gameID provided. Ending now...");
    return;
  }

  try {
    const gameDetails = await getGameDetails(gameId);
  } catch (error) {
    log.error(error, "Error caught inside init func.");
    // and catch?
  }
};

init();
