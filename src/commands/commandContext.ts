import { Message } from "discord.js";

export class CommandContext {
  readonly command: string;
  readonly args: string[];
  readonly message: Message;
  readonly commandPrefix: string;

  constructor(message: Message, prefix: string) {
    const args = message.content.slice(prefix.length).trim().split(/ -/g);

    this.command = args.shift()!.toLowerCase();
    this.args = args;
    this.message = message;
    this.commandPrefix = prefix;
  }
}
