import argv from "./argv";
import pino from "pino";

const log = pino({
  name: "game-cli",
  level: argv.verbose ? "debug" : "info",
  transport: {
    target: "pino-pretty",
  },
});

export default log;
