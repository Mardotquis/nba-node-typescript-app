// Details for a game.
export interface gameDetail {
  p: number; // Period
}

export interface playByPlayEvents {
  pid: number; // Player ID
}

// All events played in a single period.
export interface playByPlay {
  pla: playByPlayEvents[];
}
