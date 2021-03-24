import { Command } from "./command";
import { CommandContext } from "./commandContext";
import { configBot, BotConfig } from "../configBot";
import { AnilistRequest } from "../utils/AnilistRequest";
import { KmRequest } from "../utils/KmRequest";
import { MessageEmbed } from "discord.js";

interface Prop {
  tid: string;
  types: Array<number>;
  name: string;
  short: any;
  aliases: Array<string>;
  i18n: {
    eng: string;
    jpn: string;
  };

}

export class GuessAnimeCommand implements Command {
  private config: BotConfig;
  private anilistRequest: AnilistRequest;
  private kmRequest: KmRequest;
  commandActivated: boolean = true;
  Season: string[] = ["WINTER", "SPRING", "SUMMER", "FALL", "ALL"];
  Format: string[] = ["TV", "MOVIE", "OVA"];

  constructor() {
    this.config = configBot;
    this.anilistRequest = new AnilistRequest();
    this.kmRequest = new KmRequest();
  }
  commandNames: string[] = ["guessanime"];

  private checkArgsSeason(CommandContext: CommandContext): boolean {
    let check: boolean = true;
    if (CommandContext.args[0]) {
      if (CommandContext.args[0].split(/ /g).length > 1) {
        CommandContext.args[0].split(/ /g).map((season) => {
          if (!this.Season.includes(season) || season === "ALL") {
            check = false;
          }
        });
      }
      if ((CommandContext.args[0].split(/ /g).length = 1)) {
        CommandContext.args[0].split(/ /g).map((season) => {
          if (!this.Season.includes(season)) {
            check = false;
          }
        });
      }
    }
    return check;
  }

  private checkArgsSeasonYear(CommandContext: CommandContext): boolean {
    let check: boolean = true;
    if (CommandContext.args[1]) {
      if (
        Number(CommandContext.args[1]) < 1940 ||
        Number(CommandContext.args[1]) > new Date().getFullYear()
      ) {
        check = false;
      }
    }
    return check;
  }

  private checkArgsNsfw(CommandContext: CommandContext): boolean {
    let check: boolean = true;
    if (CommandContext.args[2]) {
      if (
        CommandContext.args[2] != String("true") &&
        CommandContext.args[2] != String("false")
      ) {
        check = false;
      }
    }
    return check;
  }

  private checkArgsFormat(CommandContext: CommandContext): boolean {
    let check: boolean = true;
    if (CommandContext.args[3]) {
      if (CommandContext.args[3].split(/ /g).length >= 1) {
        CommandContext.args[3].split(/ /g).map((format) => {
          if (!this.Format.includes(format)) {
            check = false;
          }
        });
      }
    }
    return check;
  }
  async run(CommandContext: CommandContext): Promise<void> {
    
    if (
      !this.checkArgsSeason(CommandContext) ||
      !this.checkArgsSeasonYear(CommandContext) ||
      !this.checkArgsNsfw(CommandContext) ||
      !this.checkArgsFormat(CommandContext)
    ) {
      CommandContext.message.reply("Arguments is not valid");
      return;
    }

    const defineVariable = (
      page: number = 1,
      season: string = "FALL",
      seasonYear: number = 2021,
      isAdult: boolean = false,
      format: string = "TV",
      popularityRatio: number = 3000
    ) => {
      let variables = {
        page: page,
        perPage: 1,
        season: season,
        seasonYear: seasonYear,
        isAdult: isAdult,
        format: format,
        popularityRatio: popularityRatio,
      };
      return variables;
    };

    const Query = async (season?: string) => {
      let query = `
        query ($page: Int, $perPage: Int, $season: MediaSeason, $seasonYear: Int, $isAdult: Boolean, $format: MediaFormat, $popularityRatio: Int) {
        Page (page: $page, perPage: $perPage) {
            pageInfo {
            total
            currentPage
            lastPage
            hasNextPage
            perPage
        }
        media (type: ANIME, season: $season, seasonYear: $seasonYear, isAdult: $isAdult, format: $format, popularity_greater: $popularityRatio) {
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
          CommandContext.args[2]
            ? CommandContext.args[2].toLowerCase() === "true"
              ? Boolean(CommandContext.args[2])
              : false
            : false,
          CommandContext.args[3] ? CommandContext.args[3] : undefined,
          CommandContext.args[2]
            ? CommandContext.args[2].toLowerCase() === "true"
              ? 1
              : 3000
            : 3000
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
          CommandContext.args[2] && CommandContext.args[2] === "true"
            ? Boolean(CommandContext.args[2])
            : false,
          CommandContext.args[3] ? CommandContext.args[3] : undefined,
          CommandContext.args[2] === "true" ? 1 : 3000
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
          Math.random() * (this.Season.length - 1)
        );
        queryRes = await Query(this.Season[randomSeason]);
      } else {
        queryRes = await Query(CommandContext.args[0]);
      }
    } else {
      queryRes = await Query();
    }

    const addAliases = (aliases: Array<string>, answers: Array<string>) => {
      aliases.map((aliase) => {
        if (!answers.includes(aliase)) {
          answers.push(aliase);
        }
      });
    };

    const addEnglishName = (engName: string, answers: Array<string>) => {
      if (!answers.includes(engName)) {
        answers.push(engName);
      }
    };

    const addJpnName = (jpnName: string, answers: Array<string>) => {
      if (!answers.includes(jpnName)) {
        answers.push(jpnName);
      }
    };

    const addName = (name: string, answers: Array<string>) => {
      if (!answers.includes(name)) {
        answers.push(name);
      }
    };

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

      const KMREQUEST = await this.kmRequest.apiCall(
        "https://kara.moe/api/karas/tags/1?from=0&size=5000&order=karacount&stripEmpty=true"
      );
      if (KMREQUEST.error) {
        console.log(console.error(KMREQUEST.error));
        return;
      }

      const Prop = JSON.parse(JSON.stringify(KMREQUEST.content));

      Prop.map((propFormated: Prop) => {
        if (nameRomaji) {
          if (propFormated.name) {
            if (nameRomaji.toLowerCase() === propFormated.name.toLowerCase()) {
              if (propFormated.aliases.length > 0) {
                addAliases(propFormated.aliases, answers);
              }
              if (propFormated.i18n.eng) {
                addEnglishName(propFormated.i18n.eng, answers);
              }
              if (propFormated.i18n.jpn) {
                addJpnName(propFormated.i18n.jpn, answers);
              }
            }
          }
          if (propFormated.i18n.eng) {
            if (
              nameRomaji.toLowerCase() === propFormated.i18n.eng.toLowerCase()
            ) {
              if (propFormated.aliases.length > 0) {
                addAliases(propFormated.aliases, answers);
              }
              if (propFormated.i18n.jpn) {
                addJpnName(propFormated.i18n.jpn, answers);
              }
              if (propFormated.name) {
                addName(propFormated.name, answers);
              }
            }
          }
          if (propFormated.i18n.jpn) {
            if (
              nameRomaji.toLowerCase() === propFormated.i18n.jpn.toLowerCase()
            ) {
              if (propFormated.aliases.length > 0) {
                addAliases(propFormated.aliases, answers);
              }
              if (propFormated.name) {
                addName(propFormated.name, answers);
              }
              if (propFormated.i18n.eng) {
                addEnglishName(propFormated.i18n.eng, answers);
              }
            }
          }
          if (propFormated.aliases) {
            if (propFormated.aliases.includes(nameRomaji)) {
              addAliases(propFormated.aliases, answers);

              if (propFormated.i18n.eng) {
                addEnglishName(propFormated.i18n.eng, answers);
              }
              if (propFormated.i18n.jpn) {
                addJpnName(propFormated.i18n.jpn, answers);
              }
              if (propFormated.name) {
                addName(propFormated.name, answers);
              }
            }
          }
        }

        if (nameEnglish) {
          if (propFormated.name) {
            if (nameEnglish.toLowerCase() === propFormated.name.toLowerCase()) {
              if (propFormated.aliases.length > 0) {
                addAliases(propFormated.aliases, answers);
              }
              if (propFormated.i18n.eng) {
                addEnglishName(propFormated.i18n.eng, answers);
              }
              if (propFormated.i18n.jpn) {
                addJpnName(propFormated.i18n.jpn, answers);
              }
            }
          }
          if (propFormated.i18n.eng) {
            if (
              nameEnglish.toLowerCase() === propFormated.i18n.eng.toLowerCase()
            ) {
              if (propFormated.aliases.length > 0) {
                addAliases(propFormated.aliases, answers);
              }
              if (propFormated.i18n.jpn) {
                addJpnName(propFormated.i18n.jpn, answers);
              }
              if (propFormated.name) {
                addName(propFormated.name, answers);
              }
            }
          }
          if (propFormated.i18n.jpn) {
            if (
              nameEnglish.toLowerCase() === propFormated.i18n.jpn.toLowerCase()
            ) {
              if (propFormated.aliases.length > 0) {
                addAliases(propFormated.aliases, answers);
              }
              if (propFormated.name) {
                addName(propFormated.name, answers);
              }
              if (propFormated.i18n.eng) {
                addEnglishName(propFormated.i18n.eng, answers);
              }
            }
          }
          if (propFormated.aliases) {
            if (propFormated.aliases.includes(nameEnglish)) {
              addAliases(propFormated.aliases, answers);

              if (propFormated.i18n.eng) {
                addEnglishName(propFormated.i18n.eng, answers);
              }
              if (propFormated.i18n.jpn) {
                addJpnName(propFormated.i18n.jpn, answers);
              }
              if (propFormated.name) {
                addName(propFormated.name, answers);
              }
            }
          }
        }

        if (nameNative) {
          if (propFormated.name) {
            if (nameNative.toLowerCase() === propFormated.name.toLowerCase()) {
              if (propFormated.aliases.length > 0) {
                addAliases(propFormated.aliases, answers);
              }
              if (propFormated.i18n.eng) {
                addEnglishName(propFormated.i18n.eng, answers);
              }
              if (propFormated.i18n.jpn) {
                addJpnName(propFormated.i18n.jpn, answers);
              }
            }
          }
          if (propFormated.i18n.eng) {
            if (
              nameNative.toLowerCase() === propFormated.i18n.eng.toLowerCase()
            ) {
              if (propFormated.aliases.length > 0) {
                addAliases(propFormated.aliases, answers);
              }
              if (propFormated.i18n.jpn) {
                addJpnName(propFormated.i18n.jpn, answers);
              }
              if (propFormated.name) {
                addName(propFormated.name, answers);
              }
            }
          }
          if (propFormated.i18n.jpn) {
            if (
              nameNative.toLowerCase() === propFormated.i18n.jpn.toLowerCase()
            ) {
              if (propFormated.aliases.length > 0) {
                addAliases(propFormated.aliases, answers);
              }
              if (propFormated.name) {
                addName(propFormated.name, answers);
              }
              if (propFormated.i18n.eng) {
                addEnglishName(propFormated.i18n.eng, answers);
              }
            }
          }
          if (propFormated.aliases) {
            if (propFormated.aliases.includes(nameNative)) {
              addAliases(propFormated.aliases, answers);

              if (propFormated.i18n.eng) {
                addEnglishName(propFormated.i18n.eng, answers);
              }
              if (propFormated.i18n.jpn) {
                addJpnName(propFormated.i18n.jpn, answers);
              }
              if (propFormated.name) {
                addName(propFormated.name, answers);
              }
            }
          }
        }
      });

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
              "Looks like nobody got the answer this time. \nAnswers were : \n" +
                `${answers[0] != null ? "- " + `${answers[0]}` + "\n" : ""}` +
                `${answers[1] != null ? "- " + `${answers[1]}` + "\n" : ""}` +
                `${answers[2] != null ? "- " + `${answers[2]}` + "\n" : ""}` +
                `${answers[3] != null ? "- " + `${answers[3]}` + "\n" : ""}` +
                `${answers[4] != null ? "- " + `${answers[4]}` + "\n" : ""}` +
                `${answers[5] != null ? "- " + `${answers[5]}` + "\n" : ""}` +
                `${answers[6] != null ? "- " + `${answers[6]}` + "\n" : ""}` +
                `${answers[7] != null ? "- " + `${answers[7]}` + "\n" : ""}` +
                `${answers[8] != null ? "- " + `${answers[8]}` + "\n" : ""}` +
                `${answers[9] != null ? "- " + `${answers[9]}` + "\n" : ""}` +
                `${answers[10] != null ? "- " + `${answers[10]}` + "" : ""}`
            );
          });
      });
    } else {
      CommandContext.message.reply("Error collecting data please try again");
    }
  }
}
