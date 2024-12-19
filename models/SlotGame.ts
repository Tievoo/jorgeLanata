import { Message, TextChannel } from "discord.js";
import { addBalance } from "../funcs/casino.utils.ts";

type Slot = { icon: string; weight: number; three: number; two: number; };

export class SlotGame {
    static readonly emojiWeights: Slot[] = [
        { icon: "🍒", weight: 25, three: 2, two:1 },
        { icon: "🍋", weight: 25, three: 2, two: 1 },
        { icon: "🍇", weight: 15, three: 7, two:2 },
        { icon: "🍊", weight: 15, three: 7, two:2 },
        { icon: "💎", weight: 8, three: 16, two:7 },
        { icon: "🍀", weight: 8, three: 16, two:7 },
        { icon: "🌟", weight: 4, three: 50, two:12 },
    ];

    static slotRollingEmojis = ["<a:slotsspin1:1319139855069876224>", "<a:slotsspin2:1319139873260830730>", "<a:slotsspin3:1319139885210406983>"]

    private static readonly TOTAL_WEIGHT = 100;

    static getRandomSlot(): Slot {
        const rand = Math.floor(Math.random() * this.TOTAL_WEIGHT);
        let sum = 0;
        for (const emoji of this.emojiWeights) {
            sum += emoji.weight;
            if (rand < sum) {
                return emoji;
            }
        }
        return this.emojiWeights[0];
    }

    static getSlotResult(): Slot[] {
        return [this.getRandomSlot(), this.getRandomSlot(), this.getRandomSlot()];
    }

    static calculatePayout(result: Slot[], bet: number): number {
        if (result[0].icon === result[1].icon && result[1].icon === result[2].icon) {
            return result[0].three * bet;
        }
        if (result[0].icon === result[1].icon || result[1].icon === result[2].icon || result[0].icon === result[2].icon) {
            const twoMatch = result[0].icon === result[1].icon || result[1].icon === result[2].icon ? result[1] : result[0];
            const thirdIcon = result[0].icon === result[1].icon ? result[2] : result[0];

            if (twoMatch.two < 5 && thirdIcon.icon === "🌟") {
                return twoMatch.two * bet * 1.5;
            }
            return twoMatch.two * bet;
        }
        return 0;
    }

    static async run(bet: number, message: Message) {
        const result = this.getSlotResult();
        const payout = this.calculatePayout(result, bet);
        const slotMessage = await (message.channel as TextChannel).send(`${this.slotRollingEmojis[0]}${this.slotRollingEmojis[1]}${this.slotRollingEmojis[2]}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await slotMessage.edit(`${result[0].icon}${this.slotRollingEmojis[1]}${this.slotRollingEmojis[2]}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await slotMessage.edit(`${result[0].icon}${result[1].icon}${this.slotRollingEmojis[2]}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await slotMessage.edit(`${result[0].icon}${result[1].icon}${result[2].icon}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        await slotMessage.edit(`${result[0].icon}${result[1].icon}${result[2].icon}\n${payout === 0 ? "Perdiste todo" : `Ganaste ${payout}!`}`);
        addBalance(message.author.id, payout);

    }

}
