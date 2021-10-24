// Details for a game.
export interface IGameDetail {
  p: number; // Period
}

export interface IPlayByPlayEvents {
  pid: number; // Player ID
}

// All events played in a single period.
export interface IPlayByPlay {
  pla: IPlayByPlayEvents[];
}
