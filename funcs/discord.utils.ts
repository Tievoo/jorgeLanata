import { GuildMember, PermissionFlagsBits } from "discord.js";

export function isUserAdmin(member: GuildMember): boolean {
  return member.permissions.has(PermissionFlagsBits.Administrator);
}

export function isTievo(id: string): boolean {
  return id === "279775093142323210";
}

export const kakeraEmoji = "<:kakera:1309807660987846686>";
