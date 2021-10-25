import { IPlayByPlayEvents, IRawPlayByPlayResponse } from "./types";

export const combinePlayByPlayEvents = (
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
