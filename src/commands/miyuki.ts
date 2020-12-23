import { Command } from "./command";
import { CommandContext } from "./commandContext";
import { Client } from "discord.js";

export class MiyukiCommand implements Command {
  private client: Client;
  constructor() {
    this.client = new Client();
  }
  commandNames: string[] = ["miyuki"];
  async run(CommandContext: CommandContext): Promise<void> {
    CommandContext.message.reply(
      `10/10 would bang ! <:test:${this.emojis("791343748482203698")}>`
    );
  }
  private emojis(id: string) {
    return this.client.emojis.resolveIdentifier(id);
  }
}
