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

    static run(bet: number, message: Message) {
        const result = this.getSlotResult();
        const payout = this.calculatePayout(result, bet);
        const slotString = result.map(emoji => emoji.icon).join(" ");
        addBalance(message.author.id, payout);
        return (message.channel as TextChannel).send(`${slotString}\n${payout ? `Ganaste ${payout}!` : "La perdiste toda"}`);
    }


}
