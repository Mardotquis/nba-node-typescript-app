// Details for a game.
export interface IGameDetail {
  gid: string; // Game ID
  p: number; // Period
}

export interface IRawGameDetailResponse {
  g: IGameDetail;
}

// All events played in a single period.
export interface IPlayByPlayEvent {
  pid: number; // Player ID
}

export interface IRawPlayByPlayResponse {
  g: {
    pla: IPlayByPlayEvent[];
  };
}

export interface IPlayByPlayEvents {
  gid: string;
  pla: IPlayByPlayEvent[];
}

export interface IPlayerEvents {
  [pid: string]: IPlayByPlayEvent[];
}

export type GroupedEvents = Omit<IPlayByPlayEvents, "pla"> & {
  playerEvents: IPlayerEvents;
};
