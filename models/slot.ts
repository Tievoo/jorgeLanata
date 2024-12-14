import { Message, TextChannel } from "discord.js";
import { addBalance } from "../funcs/casino.utils.ts";

type Slot = { icon: string; weight: number; three: number; two: number; };

export class SlotGame {
    private static readonly emojiWeights: Slot[] = [
        { icon: "🍒", weight: 25, three: 3.5, two:1 },
        { icon: "🍋", weight: 25, three: 4, two: 1 },
        { icon: "🍇", weight: 15, three: 8, two:2 },
        { icon: "🍊", weight: 15, three: 10, two:2 },
        { icon: "💎", weight: 8, three: 20, two:5 },
        { icon: "🍀", weight: 8, three: 25, two:5 },
        { icon: "🌟", weight: 4, three: 50, two:8 },
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
