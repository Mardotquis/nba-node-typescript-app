import { argv } from "process";
import log from "./util/log";
import { run } from "./game";

log.info("Welcome to the game-cli: 🏀 75th Anniversary Edition 🏀!");
log.debug(argv, "game-cli starting with the following args...");

run();
