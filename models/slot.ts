import { Message, TextChannel } from "discord.js";
import { addBalance } from "../funcs/casino.utils.ts";

type Slot = { icon: string; weight: number; payout: number; };

export class SlotGame {
    private static readonly emojiWeights: Slot[] = [
        { icon: "🍒", weight: 30, payout: 2 },
        { icon: "🍋", weight: 25, payout: 3 },
        { icon: "🍇", weight: 20, payout: 3.5 },
        { icon: "🍉", weight: 15, payout: 4 },
        { icon: "⭐", weight: 10, payout: 5 },
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
            return result[0].payout * bet;
        }
        // if (result[0].icon === result[1].icon || result[1].icon === result[2].icon) {
        //     return result[1].payout * 2;
        // }
        return 0;
    }

    static run(bet: number, message: Message) {
        const result = this.getSlotResult();
        const payout = this.calculatePayout(result, bet);
        const slotString = result.map(emoji => emoji.icon).join(" ");
        addBalance(message.author.id, payout);
        return (message.channel as TextChannel).send(`${slotString}\n${payout ? `You won ${payout}!` : "You lost!"}`);
    }


}
