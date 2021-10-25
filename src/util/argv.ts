import yargs from "yargs/yargs";

const argv = yargs(process.argv.slice(2))
  .scriptName("game-cli")
  .usage("$0 [args]")
  .option("verbose", {
    alias: "v",
    type: "boolean",
    description: "Run with verbose logging",
  })
  .option("gameId", {
    alias: "g",
    type: "string",
    description: "Game ID",
    demandOption: true,
  })
  .parseSync();

export default argv;
