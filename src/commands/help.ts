import { Command } from "./command";
import { CommandContext } from "./commandContext";
import { MessageEmbed } from "discord.js";

export class HelpCommand implements Command {
  commandNames: string[] = ["help"];
  commandActivated: boolean = true;
  async run(CommandContext: CommandContext): Promise<void> {
    const embed = new MessageEmbed();
    embed.setTitle("List of Commands");
    embed.setColor(7285781);
    embed.setDescription(
      "**Quizz**\n\n`!guessanime -[season] -[seasonYear] -[nsfw]`\n\n`season : WINTER | SPRING | SUMMER | FALL\nseasonYear : 1940 to " +
        `${new Date().getFullYear()}` +
        "\nnsfw : true | false`\n\nThe bot will show you an image. By default it's the cover image that is on anilist and you will have to find out which anime the image comes from.\n\n**Troll**\n\n`!miyuki`\n\n The bot will say that he will bang miyuki"
    );

    CommandContext.message.channel.send(embed);
  }
}
