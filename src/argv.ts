import { hideBin } from "yargs/helpers";
import yargs from "yargs/yargs";

const argv = yargs(hideBin(process.argv))
  .scriptName("game-cli")
  .usage("$0 [args]")
  .option("verbose", {
    alias: "v",
    type: "boolean",
    description: "Run with verbose logging",
  })
  .option("gameId", {
    alias: "g",
    type: "number",
    description: "Game ID",
    demandOption: true,
  })
  .parseSync();

export default argv;
