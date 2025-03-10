import path from "node:path";
import { Bet } from "../types/casino.types.ts";
import { loadImage, createCanvas, Image } from "https://deno.land/x/canvas@v1.4.2/mod.ts";
import { Buffer } from "node:buffer";
import { AttachmentBuilder } from "discord.js";

export type Coord = { x: number, y: number }

const chips = ["chip0", "chip50", "chip100", "chip200", "chip500", "chip1000", "chip2000"]
const chipAmounts = [0, 50, 100, 200, 500, 1000, 2000]

export class BetDisplay {
    static BASE_NUMBER_POS = { x: 243, y: 130 }
    static Y_NUMBER_JUMP = 79
    static X_NUMBER_JUMP = 81.5

    private static template : Image
    private static chips : Image[]

    static async init() {
        this.template = await loadImage(path.resolve("images/bet_template.png"));
        this.chips = await Promise.all(chips.map(chip => loadImage(path.resolve(`images/${chip}.png`))))
    }

    static fromBet(bets: Bet[]): AttachmentBuilder {
        const canvas = createCanvas(this.template.width(), this.template.height());
        const ctx = canvas.getContext("2d");
        ctx.drawImage(this.template, 0, 0);

        
        ctx.fillStyle = "white";
        ctx.font = "bold 12px Helvetica";

        for (const bet of bets) {
            const chip = this.getChip(bet.amount);
            const coords = bet.slot.displayCoords();
            ctx.drawImage(chip, coords.x - chip.width()/2, coords.y - chip.height()/2);
            const text = bet.amount.toString();
            const textX = coords.x - 3.5*text.length;
            const textY = coords.y + 4;
            ctx.fillText(text, textX, textY);
        }

        return new AttachmentBuilder(Buffer.from(canvas.toBuffer("image/png")), {
            name: "stats.png"
        });
    }

    static getChip(amount: number): Image {
        let index = chipAmounts.findIndex(c => c > amount);
        if (index === -1) return this.chips[this.chips.length - 1];
        index = Math.max(0, index - 1);
        return this.chips[index]
    }
}

BetDisplay.init();
