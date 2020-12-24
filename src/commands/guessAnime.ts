import { Command } from "./command";
import { CommandContext } from "./commandContext";
import { configBot, BotConfig } from "../configBot";
import { AnilistRequest } from "../utils/AnilistRequest";
import { Message, MessageCollector, MessageEmbed } from "discord.js";

export class GuessAnimeCommand implements Command {
  private config: BotConfig;
  private anilistRequest: AnilistRequest;

  constructor() {
    this.config = configBot;
    this.anilistRequest = new AnilistRequest();
  }
  commandNames: string[] = ["guessanime"];
  async run(CommandContext: CommandContext): Promise<void> {
    // CommandContext.message.reply("Coming soon!");

    let query = `
        query ($page: Int, $perPage: Int, $season: MediaSeason, $seasonYear: Int, $isAdult: Boolean) {
        Page (page: $page, perPage: $perPage) {
            pageInfo {
            total
            currentPage
            lastPage
            hasNextPage
            perPage
        }
        media (type: ANIME, season: $season, seasonYear: $seasonYear, isAdult: $isAdult) {
            id

            title {
                romaji
                english
                native
            }
            coverImage{
              extraLarge
            }
        }
        }
    }
       `;
    let variables = {
      page: 1,
      perPage: 1,
      season: "FALL",
      seasonYear: 2020,
      isAdult: false,
    };

    let result = await this.anilistRequest.apiCall(
      this.config.apiUrl,
      variables,
      query
    );
    let pageMax: number = result.data.Page.pageInfo.lastPage;

    let randomPage: number = Math.floor(Math.random() * pageMax) + 1; // returns a random integer from 1 to pageMax

    variables = {
      page: randomPage,
      perPage: 1,
      season: "FALL",
      seasonYear: 2020,
      isAdult: false,
    };
    result = await this.anilistRequest.apiCall(
      this.config.apiUrl,
      variables,
      query
    );

    if (
      result.data.Page.media[0].coverImage.extraLarge &&
      result.data.Page.media[0].title.romaji &&
      result.data.Page.media[0].title.english &&
      result.data.Page.media[0].title.native
    ) {
      const image: string = result.data.Page.media[0].coverImage.extraLarge;
      const nameRomaji: string = result.data.Page.media[0].title.romaji;
      const nameEnglish: string = result.data.Page.media[0].title.english;
      const nameNative: string = result.data.Page.media[0].title.native;
      const embedWithImage = new MessageEmbed().setImage(image);

      const answers = [nameRomaji, nameEnglish, nameNative];
      console.log(answers);

      const filter = (response: { content: string }) => {
        return answers.some(
          (answer) => answer.toLowerCase() === response.content.toLowerCase()
        );
      };

      CommandContext.message.channel.send(embedWithImage).then(() => {
        CommandContext.message.channel
          .awaitMessages(filter, { max: 1, time: 15000, errors: ["time"] })
          .then((collected) => {
            CommandContext.message.channel.send(
              `${collected.first()!.author} got the correct answer!`
            );
          })
          .catch((collected) => {
            CommandContext.message.channel.send(
              "Looks like nobody got the answer this time."
            );
          });
      });
    } else {
      console.log(result.data.Page.media[0].coverImage.extraLarge);
      console.log(result.data.Page.media[0].title.romaji);
      console.log(result.data.Page.media[0].title.english);
      console.log(result.data.Page.media[0].title.native);
      CommandContext.message.reply("Error collecting data please try again");
    }
  }
}
