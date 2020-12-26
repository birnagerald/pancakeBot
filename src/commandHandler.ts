import { Message } from "discord.js";
import { Command } from "./commands/command";
import { CommandContext } from "./commands/commandContext";
import { PingCommand } from "./commands/ping";
import { MiyukiCommand } from "./commands/miyuki";
import { GuessAnimeCommand } from "./commands/guessAnime";

export class CommandHandler {
  private commands: Command[];
  private readonly prefix: string;

  constructor(prefix: string) {
    const commandClasses = [PingCommand, MiyukiCommand, GuessAnimeCommand];

    this.commands = commandClasses.map((commandClass) => new commandClass());
    this.prefix = prefix;
  }

  async handleMessage(message: Message): Promise<void> {
    if (message.author.bot || !this.isCommand(message)) return;
    // if (!this.isFromOwner(message)) {
    //   await message.reply(`You don't have permissions to execute this command`);
    //   return;
    // }
    const commandContext = new CommandContext(message, this.prefix);
    const matchedCommands = this.commands.find((command) =>
      command.commandNames.includes(commandContext.command)
    );

    if (!matchedCommands) {
      await message.reply(`Command not found, try ${this.prefix}help`);
    } else {
      this.isActivated(matchedCommands)
        ? await matchedCommands.run(commandContext)
        : await message.reply(`This command is disabled for the moment`);
    }
  }
  private isCommand(message: Message): boolean {
    return message.content.startsWith(this.prefix);
  }

  private isFromOwner(message: Message): boolean {
    return message.author.id === "119562280974155776";
  }

  private isActivated(command: Command): boolean {
    if (command.commandActivated === true) {
      return true;
    } else {
      return false;
    }
  }
}
