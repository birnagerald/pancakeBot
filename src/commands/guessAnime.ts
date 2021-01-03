import { Command } from "./command";
import { CommandContext } from "./commandContext";
import { configBot, BotConfig } from "../configBot";
import { AnilistRequest } from "../utils/AnilistRequest";
import { MessageEmbed } from "discord.js";

export class GuessAnimeCommand implements Command {
  private config: BotConfig;
  private anilistRequest: AnilistRequest;
  commandActivated: boolean = true;
  Season: string[] = ["WINTER", "SPRING", "SUMMER", "FALL"];

  constructor() {
    this.config = configBot;
    this.anilistRequest = new AnilistRequest();
  }
  commandNames: string[] = ["guessanime"];
  private checkArgs(CommandContext: CommandContext): boolean {
    if (CommandContext.args[0]) {
      if (CommandContext.args[0].split(/ /g).length > 1) {
        CommandContext.args[0].split(/ /g).map((season) => {
          if (!this.Season.includes(season)) {
            return false;
          }
        });
        if (CommandContext.args[1]) {
          if (
            Number(CommandContext.args[1]) >= 1940 &&
            Number(CommandContext.args[1]) <= new Date().getFullYear()
          ) {
            if (CommandContext.args[2]) {
              if (
                CommandContext.args[2] === "true" ||
                CommandContext.args[2] === "false"
              ) {
                return true;
              } else {
                return false;
              }
            }
            return true;
          } else {
            return false;
          }
        }
        return true;
      } else {
        if (
          this.Season.includes(CommandContext.args[0]) ||
          CommandContext.args[0] === "ALL"
        ) {
          if (CommandContext.args[1]) {
            if (
              Number(CommandContext.args[1]) >= 1940 &&
              Number(CommandContext.args[1]) <= new Date().getFullYear()
            ) {
              if (CommandContext.args[2]) {
                if (
                  CommandContext.args[2] === "true" ||
                  CommandContext.args[2] === "false"
                ) {
                  return true;
                } else {
                  return false;
                }
              }
              return true;
            } else {
              return false;
            }
          }
          return true;
        } else {
          return false;
        }
      }
    }
    return true;
  }
  async run(CommandContext: CommandContext): Promise<void> {
    if (!this.checkArgs(CommandContext)) {
      CommandContext.message.reply("Arguments is not valid");
      return;
    }

    const defineVariable = (
      page: number = 1,
      season: string = "FALL",
      seasonYear: number = 2020,
      isAdult: boolean = false
    ) => {
      let variables = {
        page: page,
        perPage: 1,
        season: season,
        seasonYear: seasonYear,
        isAdult: isAdult,
      };
      return variables;
    };

    const Query = async (season?: string) => {
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
            synonyms
        }
        }
    }
       `;

      let result = await this.anilistRequest.apiCall(
        this.config.apiUrl,
        defineVariable(
          1,
          season ? season : undefined,
          CommandContext.args[1] ? Number(CommandContext.args[1]) : undefined,
          CommandContext.args[2] &&
            CommandContext.args[2].toLowerCase() === "true"
            ? Boolean(CommandContext.args[2])
            : false
        ),
        query
      );
      let pageMax: number = result.data.Page.pageInfo.lastPage;

      let randomPage: number = Math.floor(Math.random() * pageMax) + 1; // returns a random integer from 1 to pageMax

      result = await this.anilistRequest.apiCall(
        this.config.apiUrl,
        defineVariable(
          randomPage,
          season ? season : undefined,
          CommandContext.args[1] ? Number(CommandContext.args[1]) : undefined,
          CommandContext.args[2] &&
            CommandContext.args[2].toLowerCase() === "true"
            ? Boolean(CommandContext.args[2])
            : false
        ),
        query
      );
      return result;
    };

    let queryRes;

    if (CommandContext.args[0]) {
      if (CommandContext.args[0].split(/ /g).length > 1) {
        let randomSeason: number = Math.floor(
          Math.random() * CommandContext.args[0].split(/ /g).length
        );

        queryRes = await Query(
          CommandContext.args[0].split(/ /g)[randomSeason]
        );
      } else if (CommandContext.args[0] === "ALL") {
        let randomSeason: number = Math.floor(
          Math.random() * this.Season.length
        );

        queryRes = await Query(this.Season[randomSeason]);
      } else {
        queryRes = await Query(CommandContext.args[0]);
      }
    } else {
      queryRes = await Query();
    }

    if (queryRes.data.Page.media[0].coverImage.extraLarge) {
      const image: string = queryRes.data.Page.media[0].coverImage.extraLarge;
      const nameRomaji: string = queryRes.data.Page.media[0].title.romaji;
      const nameEnglish: string = queryRes.data.Page.media[0].title.english;
      const nameNative: string = queryRes.data.Page.media[0].title.native;
      const synonyms: string[] = queryRes.data.Page.media[0].synonyms;
      const embedWithImage = new MessageEmbed().setImage(image);

      const answers = [nameRomaji, nameEnglish, nameNative];

      if (synonyms.length > 0) {
        synonyms.map((synonym) => {
          answers.push(synonym);
        });
      }

      if (nameRomaji === null) {
        let index = answers.indexOf(nameRomaji);
        answers.splice(index, 1);
      } else if (nameEnglish === null) {
        let index = answers.indexOf(nameEnglish);
        answers.splice(index, 1);
      } else if (nameNative === null) {
        let index = answers.indexOf(nameNative);
        answers.splice(index, 1);
      }
      console.log(answers);

      const filter = (response: { content: string }) => {
        return answers.some(
          (answer) =>
            answer.toLowerCase() === response.content.toLowerCase() ||
            response.content.toLowerCase() === "pass"
        );
      };

      CommandContext.message.channel.send(embedWithImage).then(() => {
        CommandContext.message.channel
          .awaitMessages(filter, { max: 1, time: 15000, errors: ["time"] })
          .then((collected) => {
            if (collected.first()!.content === "pass") {
              CommandContext.message.channel.send(`Canceled`);
            } else {
              CommandContext.message.channel.send(
                `${collected.first()!.author} got the correct answer!`
              );
            }
          })
          .catch((collected) => {
            CommandContext.message.channel.send(
              "Looks like nobody got the answer this time. \nThe answers was : \n" +
                `${answers[0] != null ? "- " + `${answers[0]}` + "\n" : ""}` +
                `${answers[1] != null ? "- " + `${answers[1]}` + "\n" : ""}` +
                `${answers[2] != null ? "- " + `${answers[2]}` + "" : ""}`
            );
          });
      });
    } else {
      CommandContext.message.reply("Error collecting data please try again");
    }
  }
}
