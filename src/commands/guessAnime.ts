import { Command } from "./command";
import { CommandContext } from "./commandContext";
import { configBot, BotConfig } from "../configBot";
import { AnilistRequest } from "../utils/AnilistRequest";

export class GuessAnimeCommand implements Command {
  private config: BotConfig;
  private anilistRequest: AnilistRequest;

  constructor() {
    this.config = configBot;
    this.anilistRequest = new AnilistRequest();
  }
  commandNames: string[] = ["guessanime"];
  async run(CommandContext: CommandContext): Promise<void> {
    CommandContext.message.reply("Coming soon!");

    let query = `
        query ($page: Int, $perPage: Int, $season: MediaSeason, $seasonYear: Int) {
        Page (page: $page, perPage: $perPage) {
            pageInfo {
            total
            currentPage
            lastPage
            hasNextPage
            perPage
        }
        media (type: ANIME, season: $season, seasonYear: $seasonYear) {
            id
            title {
                romaji
            }
        }
        }
    }
       `;
    let variables = {
      page: 1,
      perPage: 50,
      season: "FALL",
      seasonYear: 2020,
    };

    this.anilistRequest.apiCall(this.config.apiUrl, variables, query);
  }
}
