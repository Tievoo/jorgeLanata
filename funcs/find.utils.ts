import fs from "node:fs";
import { Game } from "../types/db.types.ts";

export function findGameById(id: string) {
    const data : Game[] = JSON.parse(fs.readFileSync("./database/games.json", "utf-8"));
    return data.find((game: Game) => game.id === id.toLowerCase());
}
