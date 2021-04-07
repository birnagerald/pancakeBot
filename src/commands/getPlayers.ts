import { Command } from "./command";
import { CommandContext } from "./commandContext";
import { RiotRequest } from "../utils/RiotRequest";
import { MessageEmbed } from "discord.js";
import fetch from "node-fetch";

interface playerInfos {
  summonerName: string;
  isBot: string;
}

const FUPANCAKE: string = "liRu4OPPE5z-dyNwG01Nxyvq2vQluX5QXApfEZY6Rjpctt4";
const SKULLION: string = "XNT_Wi2J6Cga418sx_WvpiKYqwGUCZgve94vmQRDFXvYMw";
const SELRACH64: string = "-31X6m-B91vzQ2DGRbi51z2BJZNaCOIVz7y25Eo82xloRgE";
const KUAZAR: string = "A9MX04OK86KJ2ClWmVHAq3AmoywjJQPBiv5yWvR0Rlbsbyk";
const KURAWA: string = "RWBuBMNCi6ft0WLwfFMbo6WhQpFznKmEdXazD9wxfMffrg";
const BUGGYZ: string = "Occ0ARUYHMRmXDSz9sa93DrevVOD0-66WkUwRFWDa3hl-po";

const bypass: string[] = [
  FUPANCAKE,
  SKULLION,
  SELRACH64,
  KUAZAR,
  KURAWA,
  BUGGYZ,
];

export class GetPlayersCommand implements Command {
  commandNames: string[] = ["getplayers"];
  commandActivated: boolean = true;
  commandAdmin: boolean = true;
  private RiotRequest: RiotRequest;

  constructor() {
    this.RiotRequest = new RiotRequest();
  }

  private async getAccountInfos(summonerName: string) {
    const RIOTACCOUNTREQUEST = this.RiotRequest.accountApiCall(
      "https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/" +
        `${summonerName}`
    );
    return RIOTACCOUNTREQUEST;
  }

  async run(CommandContext: CommandContext): Promise<void> {
    const RIOTREQUEST = await fetch("http://78.252.151.57:2021")
      .then((res) => res.json())
      .then((json) => {
        return json;
      });

    RIOTREQUEST.map(async (playerInfos: playerInfos) => {
      let accountInfo = {
        id: "",
        accountId: "",
        puuid: "",
        summonerLevel: 0,
      };
      if (!playerInfos.isBot) {
        accountInfo = await this.getAccountInfos(playerInfos.summonerName);
      }

      if (!bypass.includes(accountInfo.accountId)) {
        const embed = new MessageEmbed();
        embed.setTitle("op.gg profile");
        if (!playerInfos.isBot) {
          embed.setURL(
            "https://euw.op.gg/summoner/userName=" +
              `${playerInfos.summonerName}`
          );
        } else {
          embed.setURL("https://euw.op.gg/");
        }

        embed.setColor(15844367);
        embed.setDescription("Get information about current players");
        embed.setFooter(
          "PancakeBot",
          "https://cdn.discordapp.com/app-icons/743447264667762720/2fca95c221b5a3ce4614ea38fa21da0c.png"
        );
        embed.setAuthor(
          "LoL Note Tracker by Kenta",
          "https://i.imgur.com/bI6DHNf.png"
        );

        if (!playerInfos.isBot) {
          embed.addFields([
            { name: "id", value: accountInfo.id },
            { name: "accountId", value: accountInfo.accountId },
            { name: "puuid", value: accountInfo.puuid },
            { name: "summonerLevel", value: accountInfo.summonerLevel },
            {
              name: "summonerName",
              value: playerInfos.summonerName,
            },
            {
              name: "isBot",
              value: playerInfos.isBot,
            },
          ]);
        } else {
          embed.addFields([
            {
              name: "summonerName",
              value: playerInfos.summonerName,
            },
            {
              name: "isBot",
              value: playerInfos.isBot,
            },
          ]);
        }
        CommandContext.message.channel.send(embed);
      }
    });
  }
}
