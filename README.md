# NODE TYPESCRIPT EVAL

Please follow the instructions below and complete the work to the best of your ability using [TypeScript](https://www.typescriptlang.org).

## Set up

- Clone this repository: [Node Typescript Eval](https://github.com/jgraup/node-ts-eval)
- Run `npm install`
- Add [axios](https://www.npmjs.com/package/axios) as a dependency to the package. All JSON requests should be made using the `axios` library.

## Instructions

1. ✅  Create a Node.js app which takes a `gameId` command line argument.
2. ✅  Fetch the GameDetails json for the specified `gameId`.
3. ✅  Use the GameDetail response to determine how many periods were played in that game  (`p`).
4. ✅  For each period, fetch the corresponding PlayByPlay file.
5. ✅  Once all PlayByPlay files have been received, group each of the events by their Player Id (`pid`).
6. ✅  Write out the resulting object to a file called `./player-events.json`.

## Endpoints

See the [Schema Details](#SchemaDetails) section for information about the data contained in these feeds

| Feed         | URL                                                                                                       | Schema                |
| :----------- | :-------------------------------------------------------------------------------------------------------- | :-------------------- |
| Game Detail  | https://data.nba.com/data/10s/v2015/json/mobile_teams/nba/2020/scores/gamedetail/[GAMEID]_gamedetail.json | [Schema](#GameDetail) |
| Play By Play | https://data.nba.com/data/10s/v2015/json/mobile_teams/nba/2020/scores/pbp/[GAMEID]_[PERIOD]_pbp.json      | [Schema](#PlayByPlay) |

## Game Ids

- 0022000073
- 0022000248 (OT)

## Schema Details

### GameDetail

Details for a game.

- **g** *{object}* - Game
  -  **mid** *{number}* - Message ID
  -  **gid** *{string}* - Game ID
  -  **gcode** *{string}* - Game Code
  -  **next** *{string}* - Next file requested
  -  **ar** *{number}* - 0 or 1, "is video archive available". Not used.
  -  **p** *{number}* - Period
  -  **st** *{number}* - Game Status (1=pregame, 2=in progress, 3=complete)
  -  **stt** *{string}* - Game Status Text
  -  **cl** *{string}* - Clock
  -  **an** *{string}* - Arena Name
  -  **ac** *{string}* - Arena City
  -  **as** *{string}* - Arena State
  -  **gdte** *{string}* - Game Date Eastern
  -  **htm** *{string}* - Game Time for Home Team
  -  **vtm** *{string}* - Game time for Away Team
  -  **etm** *{string}* - Game Time Eastern
  -  **at** *{number}* - Attendance
  -  **dur** *{string}* - Game Duration

### PlayByPlay

All events played in a single period.

- **g** *{object}* - Game
  -  **mid** *{number}* - Message ID
  -  **gid** *{string}* - Game ID
  -  **gcode** *{string}* - Game Code
  -  **p** *{number}* - Period
  -  **next** *{string}* - Next file requested
  -  **pla** *{array}* - Play by play events
      - **evt** *{number}* - Event
      - **cl** *{string}* - Clock
      - **de** *{string}* - Description
      - **locX** *{number}* - Court location X
      - **locY** *{number}* - Court location Y
      - **opt1** *{number}* - Option – Event Type 1
      - **opt2** *{number}* - Option – Event Type 2
      - **mtype** *{number}* - Message Type
      - **etype** *{number}* - Event Type
      - **opid** *{string}* - Opposing player ID (e.g. for fouls)
      - **pid** *{number}* - Player ID
      - **tid** *{number}* - Team ID (of player id)
      - **hs** *{number}* - Home Team Score
      - **vs** *{number}* - Visitor Team Score
      - **epid** *{string}* - Extra Person ID
      - **oftid** *{number}* - The offensive team’s id