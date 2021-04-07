import { Command } from "./command";
import { CommandContext } from "./commandContext";

export class PingCommand implements Command {
  commandNames: string[] = ["ping"];
  commandActivated: boolean = false;
  commandAdmin: boolean = false;
  async run(CommandContext: CommandContext): Promise<void> {
    CommandContext.message.reply("pong");
  }
}
