import { Game } from "../types/db.types.ts";
import { gamesDB } from "../database/manager.ts";

export function findGameById(id: string) {
    const data : Game[] = gamesDB.get();
    return data.find((game: Game) => game.id === id.toLowerCase());
}
