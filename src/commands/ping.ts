import { Command } from "./command";
import { CommandContext } from "./commandContext";

export class PingCommand implements Command {
  commandNames: string[] = ["ping"];
  async run(CommandContext: CommandContext): Promise<void> {
    // CommandContext.message.reply("pong");
    CommandContext.message.channel.send(
      '<@151789101354319873> <@117250192008282112> <@117250192008282112> <@140508623712288768> Ramenez vos boules soldat !!'
    );
  }
}
