import { CommandContext } from "./commandContext";

export interface Command {
  readonly commandNames: string[];
  run(parsedUserCommand: CommandContext): Promise<void>;
}
