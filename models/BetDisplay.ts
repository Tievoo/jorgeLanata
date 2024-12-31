import path from "node:path";
import { Bet } from "../types/casino.types.ts";
import { loadImage, createCanvas, Image } from "https://deno.land/x/canvas@v1.4.2/mod.ts";
import { Buffer } from "node:buffer";
import { AttachmentBuilder } from "discord.js";
import { writeFileSync } from "node:fs"

export type Coord = { x: number, y: number }

export class BetDisplay {
    static BASE_NUMBER_POS = { x: 243, y: 130 }
    static Y_NUMBER_JUMP = 79
    static X_NUMBER_JUMP = 81.5

    private static template : Image
    private static chip : Image

    static async init() {
        this.template = await loadImage(path.resolve("images/bet_template.png"));
        this.chip = await loadImage(path.resolve("images/chip.png"));
    }

    static fromBet(bets: Bet[]): AttachmentBuilder {
        // const img = await loadImage(path.resolve("images/bet_template.png"));
        const canvas = createCanvas(this.template.width(), this.template.height());
        const ctx = canvas.getContext("2d");
        ctx.drawImage(this.template, 0, 0);

        const chip = this.chip;
        ctx.fillStyle = "white";
        ctx.font = "bold 12px Helvetica";

        for (const bet of bets) {
            const coords = bet.slot.displayCoords();
            ctx.drawImage(chip, coords.x - chip.width()/2, coords.y - chip.height()/2);
            const text = bet.amount.toString();
            const textX = coords.x - 3.5*text.length;
            const textY = coords.y + 4;
            ctx.fillText(text, textX, textY);
        }

        writeFileSync(path.resolve("bet.png"), canvas.toBuffer("image/png"))

        return new AttachmentBuilder(Buffer.from(canvas.toBuffer("image/png")), {
            name: "stats.png"
        });
    }
}

BetDisplay.init();
