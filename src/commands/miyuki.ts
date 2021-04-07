import { Command } from "./command";
import { CommandContext } from "./commandContext";
import { Client } from "discord.js";

export class MiyukiCommand implements Command {
  private client: Client;
  commandActivated: boolean = true;
  commandAdmin: boolean = true;
  constructor() {
    this.client = new Client();
  }
  commandNames: string[] = ["miyuki"];
  async run(CommandContext: CommandContext): Promise<void> {
    CommandContext.message.reply(
      `10/10 would bang ! <:haroldforbot:${this.emojis("791343748482203698")}>`
    );
  }
  private emojis(id: string) {
    return this.client.emojis.resolveIdentifier(id);
  }
}
