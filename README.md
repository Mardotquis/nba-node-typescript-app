# NODE TYPESCRIPT EVAL

Please follow the instructions below and complete the work to the best of your ability.

## Set up

- Clone this repository: [Node Typescript Eval](https://github.com/jgraup/node-ts-eval)
- Run `npm install`
- Add [axios](https://www.npmjs.com/package/axios) as a dependency to the package. All JSON requests should be made using the `axios` library.

## Endpoints

See the [Schema Details](#SchemaDetails) section for information about the data contained in these feeds

| Feed         | URL                                                                                                       | Schema                |
| :----------- | :-------------------------------------------------------------------------------------------------------- | :-------------------- |
| Game Detail  | https://data.nba.com/data/10s/v2015/json/mobile_teams/nba/2020/scores/gamedetail/[GAMEID]_gamedetail.json | [Schema](#GameDetail) |
| Play By Play | https://data.nba.com/data/10s/v2015/json/mobile_teams/nba/2020/scores/pbp/[GAMEID]_[PERIOD]_pbp.json      | [Schema](#PlayByPlay) |

## Instructions

- Create an app which takes a `gameid` command line argument.
- Fetch the GameDetails json for the specified gameid.
- Use the GameDetail response to determine how many periods were played in that game, For each period, fetch the corresponding play by play file.
- Once all PlayByPlay files have been received, group each of the events by `pid` (Player Id).
- Write out the resulting object to a file called `./player-events.json`.;

## Schema Details

### GameDetail

Details for a game.

- **g** _{object}_ - Game
  - **mid** _{number}_ - Message ID
  - **gid** _{string}_ - Game ID
  - **gcode** _{string}_ - Game Code
  - **next** _{string}_ - Next file requested
  - **ar** _{number}_ - 0 or 1, "is video archive available". Not used.
  - **p** _{number}_ - Period
  - **st** _{number}_ - Game Status (1=pregame, 2=in progress, 3=complete)
  - **stt** _{string}_ - Game Status Text
  - **cl** _{string}_ - Clock
  - **an** _{string}_ - Arena Name
  - **ac** _{string}_ - Arena City
  - **as** _{string}_ - Arena State
  - **gdte** _{string}_ - Game Date Eastern
  - **htm** _{string}_ - Game Time for Home Team
  - **vtm** _{string}_ - Game time for Away Team
  - **etm** _{string}_ - Game Time Eastern
  - **at** _{number}_ - Attendance
  - **dur** _{string}_ - Game Duration

### PlayByPlay

All events played in a single period.

- **g** _{object}_ - Game
  - **mid** _{number}_ - Message ID
  - **gid** _{string}_ - Game ID
  - **gcode** _{string}_ - Game Code
  - **p** _{number}_ - Period
  - **next** _{string}_ - Next file requested
  - **pla** _{array}_ - Play by play events
    - **evt** _{number}_ - Event
    - **cl** _{string}_ - Clock
    - **de** _{string}_ - Description
    - **locX** _{number}_ - Court location X
    - **locY** _{number}_ - Court location Y
    - **opt1** _{number}_ - Option – Event Type 1
    - **opt2** _{number}_ - Option – Event Type 2
    - **mtype** _{number}_ - Message Type
    - **etype** _{number}_ - Event Type
    - **opid** _{string}_ - Opposing player ID (e.g. for fouls)
    - **pid** _{number}_ - Player ID
    - **tid** _{number}_ - Team ID (of player id)
    - **hs** _{number}_ - Home Team Score
    - **vs** _{number}_ - Visitor Team Score
    - **epid** _{string}_ - Extra Person ID
    - **oftid** _{number}_ - The offensive team’s id
