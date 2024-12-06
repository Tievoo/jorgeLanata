import { GuildMember, PermissionFlagsBits } from "discord.js";

export function isUserAdmin(member: GuildMember): boolean {
  return member.permissions.has(PermissionFlagsBits.Administrator);
}

export const kakeraEmoji = "<:kakera:1309807660987846686>";
