import { AttachmentBuilder, Message, TextChannel } from "discord.js";
import { loadImage, createCanvas } from "https://deno.land/x/canvas@v1.4.2/mod.ts";
import { Buffer } from "node:buffer";
import path from 'node:path';
import { rouletteState } from "../../funcs/rula.utils.ts";
import { BetConverter } from "../../models/BetConverter.ts";
import { RouletteNumber } from "../../models/RouletteManager.ts";

const statIds = ["zero", "first", "second", "third", "firstcol", "secondcol", "thirdcol", "low", "even", "red", "black", "odd", "high"];

export async function rstats(message: Message, _: string[]) {
    const roulette = rouletteState.getRoulette(message.channelId)

    if (!roulette) {
        return (message.channel as TextChannel).send("No hay ruleta en este canal");
    }
    const stats : Record<string, number> = {}
    const top100 = roulette.lastResults.toArray()

    for (const num of top100) {
        statIds.forEach(id => {
            if (!stats[id]) stats[id] = 0
            const slot = id === "zero" ? new RouletteNumber(0) : new BetConverter.rouletteSlotMap[id]()
            const matches = slot.shouldPay(num)
            if (matches) stats[id] += 1
        })
    }

    for (const key in stats) {
        stats[key] = Math.round((stats[key] / top100.length) * 100)
    }

    const attachment = await editImage(stats);

    (message.channel as TextChannel).send({
        files: [attachment],
        embeds: [{
            title:"Algo",
            image: {
                url: `attachment://${attachment.name}`
            }
        }]
    });
}

async function editImage(stats: Record<string, number>) {

    const img = await loadImage(path.resolve("images/stats_template.png"));
    const canvas = createCanvas(img.width(), img.height());
    const ctx = canvas.getContext("2d");
    ctx.drawImage(img, 0, 0);
    ctx.textAlign = "center";
    ctx.fillStyle = "white";
    ctx.font = "bold 11px Helvetica";

    for (const key in stats) {
        const stat = stats[key];
        const text = stat+"%"
        const textMetrics = ctx.measureText(text);
        const textX = positionMap[key].x + (positionMap[key].w - textMetrics.width) / 2;
        ctx.fillText(text, textX, positionMap[key].y, positionMap[key].w);
    }

    return new AttachmentBuilder(Buffer.from(canvas.toBuffer("image/png")), {
        name: "stats.png"
    });
}

const positionMap: Record<string, { x: number, y: number, w: number}> = {
    zero: {x:18, y:19, w: 23},
    first: { x: 42, y: 19, w: 103 },
    second: { x: 146, y: 19, w: 94 },
    third: { x: 241, y: 19, w: 99 },
    firstcol: { x: 18, y: 79, w: 106 },
    secondcol: { x: 125, y: 79, w: 103 },
    thirdcol: { x: 229, y: 79, w: 111 },
    low: { x: 19, y: 133, w: 48 },
    even: { x: 73, y: 133, w: 49 },
    red: { x: 128, y: 133, w: 50 },
    black: { x: 182, y: 133, w: 50 },
    odd: { x: 236, y: 133, w: 49 },
    high: { x: 290, y: 133, w: 48 },
}

