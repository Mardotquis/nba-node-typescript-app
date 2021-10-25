import {
  getGameDetails,
  getGameID,
  getPlayByPlayEvents,
  groupPlayerEvents,
  writePlayerEvents,
} from "./utils";

import { GroupedEvents } from "./types";
import log from "../util/log";

export const run = async (): Promise<GroupedEvents> => {
  try {
    const gameId = getGameID();
    if (!gameId) {
      log.fatal("No gameID provided. Ending now...");
      return;
    }
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

    const groupedEvents = groupPlayerEvents(playByPlayEvents);
    writePlayerEvents(groupedEvents);

    return groupedEvents;
  } catch (error) {
    log.fatal(error, "Error caught inside game-cli.");
  }
};
