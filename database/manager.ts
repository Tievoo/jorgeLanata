import { JsonManager } from "../models/JsonManager.ts";
import { Casino, Game, Leaderboard } from "../types/db.types.ts";

export const casinoDB = new JsonManager<Casino>("casino.json");
export const leaderboardDB = new JsonManager<Leaderboard>("leaderboard.json");
export const gamesDB = new JsonManager<Game[]>("games.json");
