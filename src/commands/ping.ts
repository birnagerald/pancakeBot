import { Command } from "./command";
import { CommandContext } from "./commandContext";

export class PingCommand implements Command {
  commandNames: string[] = ["ping"];
  async run(CommandContext: CommandContext): Promise<void> {
    CommandContext.message.reply("pong");
  }
}
