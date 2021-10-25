import {
  GroupedEvents,
  IGameDetail,
  IPlayByPlayEvent,
  IPlayByPlayEvents,
  IPlayerEvents,
  IRawGameDetailResponse,
  IRawPlayByPlayResponse,
} from "./types";

import argv from "../util/argv";
import axios from "axios";
import fs from "fs";
import log from "../util/log";

const BASE_URL =
  "https://data.nba.com/data/10s/v2015/json/mobile_teams/nba/2020/scores";

// global axios instance with prepended URL
export const gameAPI = axios.create({
  baseURL: BASE_URL,
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

export const getGameID = (): string | null => {
  if (!argv.gameId) {
    log.error("No gameId provided. Please provide a string.");
    return null;
  }

  return argv.gameId;
};

// extracting this out incase we have to modify this later
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

export const getGameDetails = async (
  gameId: string
): Promise<IGameDetail | Error> => {
  try {
    const response = await gameAPI.get<IRawGameDetailResponse>(
      `/gamedetail/${gameId}_gamedetail.json`
    );

    log.info(`Successfully fetched game details for game '${gameId}'!`);

    return formatGameDetailsResponse(response.data);
  } catch (error) {
    const errMsg = "Error while fetching game details.";
    log.error(error, errMsg);

    return new Error(errMsg);
  }
};

const combinePlayByPlayEvents = (
  playByPlayEvents: IRawPlayByPlayResponse[],
  gid: string
): IPlayByPlayEvents => {
  const events = playByPlayEvents.reduce((all, currVal) => {
    // if data is missing(likely from request error),
    // don't concat to avoid null values inside array
    if (!currVal?.g?.pla) return all;

    return all.concat(currVal.g.pla);
  }, []);

  return { gid, pla: events };
};

export const getPlayByPlayEvents = async (
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

export const groupPlayerEvents = (
  playByPlayEvents: IPlayByPlayEvents
): GroupedEvents => {
  if (!playByPlayEvents.pla.length) {
    log.error(`No player events to group.`);
    return;
  }

  /*
    loop through all events and set up needed player
    arrays *once* to avoid unnecessary iterations
  */
  const playerEvents: IPlayerEvents = playByPlayEvents.pla.reduce(
    (all, currVal) => {
      // first check if this player has events recorded already
      if (!all[currVal.pid]) {
        // if not, start them a new array
        all[currVal.pid] = [];
      }

      // update their either new or existing array with event
      all[currVal.pid].push(currVal);
      return all;
    },
    {}
  );

  return { gid: playByPlayEvents.gid, playerEvents };
};

export const writePlayerEvents = (events: GroupedEvents) => {
  if (!events) {
    log.error(`No events provided to write.`);
    return;
  }

  const { gid } = events;
  const fileName = `player-events-${gid}.json`;

  // asynchronously writing data to a file
  fs.writeFile(fileName, JSON.stringify(events), (err) => {
    if (err) {
      log.error(err, `Error while writing to file '${fileName}'`);
    }

    log.info(
      `Successfully wrote events for game '${gid}' to file '${fileName}'.`
    );
  });
};
