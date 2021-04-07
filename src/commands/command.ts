import { CommandContext } from "./commandContext";

export interface Command {
  readonly commandNames: string[];
  readonly commandActivated: boolean;
  readonly commandAdmin: boolean;
  run(parsedUserCommand: CommandContext): Promise<void>;
}
