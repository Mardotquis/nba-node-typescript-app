import {
  IGameDetail,
  IPlayByPlayEvents,
  IRawGameDetailResponse,
  IRawPlayByPlayResponse,
} from "./types";

import argv from "./argv";
import axios from "axios";
import { combinePlayByPlayEvents } from "./utils";
import log from "./log";

log.info("Welcome to the game-cli: 🏀 75th Anniversary Edition 🏀!");
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
    log.debug(responseError, `gameAPI: error intercepted.`);

    return Promise.reject(responseError);
  }
);

const getGameID = (): string | null => {
  if (!argv.gameId) {
    log.error("No gameId provided. Please provide a string.");
    return null;
  }

  return argv.gameId;
};

// Extracting this out incase we have to modify this later.
const formatGameDetailsResponse = (
  gameDetails: IRawGameDetailResponse
): IGameDetail => {
  if (!gameDetails.g) {
    log.error("Game details response not formatted correctly.");
    return null;
  }

  const { gid, p } = gameDetails.g;

  return { gid, p };
};

const getGameDetails = async (gameId: string): Promise<IGameDetail | Error> => {
  try {
    const response = await gameAPI.get<IRawGameDetailResponse>(
      `/gamedetail/${gameId}_gamedetail.json`
    );

    log.debug(response.data, "Game details response.");
    log.info(`Successfully fetched game details for ${gameId}!`);

    return formatGameDetailsResponse(response.data);
  } catch (error) {
    const errMsg = "Error while fetching game details.";
    log.error(error, errMsg);

    return new Error(errMsg);
  }
};

const getPlayByPlayEvents = async (
  gameDetails: IGameDetail
): Promise<IPlayByPlayEvents> => {
  if (!gameDetails.p) {
    log.error(`No periods found for ${gameDetails.gid}`);
    return;
  }

  const { p: periods, gid } = gameDetails;
  let requests: Promise<IRawPlayByPlayResponse | null>[] = [];

  // initially set up promise for each period
  for (let curr = 1; curr <= periods; curr++) {
    const request = gameAPI
      .get<IRawPlayByPlayResponse>(`/pbp/${gid}_${curr}_pbp.json`)
      .then((response) => {
        log.debug(
          `Successfully fetched play by play events for period '${curr}' in game '${gid}'!`
        );

        return response.data;
      })
      .catch((error) => {
        const errMsg = `Error while fetching play by play events for period '${curr}' in game '${gid}'.`;
        log.error(error, errMsg);

        return null;
      });

    requests.push(request);
  }

  // make requests here concurrently since they don't rely on one another
  const playByPlayEvents = await Promise.all(requests);
  log.info(
    `Requests finished for all '${periods}' periods of play by play events for game '${gid}'.`
  );

  return combinePlayByPlayEvents(playByPlayEvents, gid);
};

const run = async () => {
  const gameId = getGameID();
  if (!gameId) {
    log.fatal("No gameID provided. Ending now...");
    return;
  }

  try {
    const gameDetails = await getGameDetails(gameId);
    if (gameDetails instanceof Error) {
      log.fatal(gameDetails, "Unable to fetch game details. Ending now...");
      return;
    }

    const playByPlayEvents = await getPlayByPlayEvents(gameDetails);
    if (!playByPlayEvents.pla.length) {
      log.fatal(
        playByPlayEvents,
        "No play by play events found. Ending now..."
      );
      return;
    }
  } catch (error) {
    log.fatal(error, "Error caught inside run func.");
  }
};

run();
