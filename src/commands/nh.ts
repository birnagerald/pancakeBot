import { Command } from "./command";
import { CommandContext } from "./commandContext";
const { API } = require("nhentai-api");
import { MessageEmbed } from "discord.js";
import { strict } from "assert";
import { error } from "console";

const api = new API();

export class NhCommand implements Command {
  commandNames: string[] = ["nh"];
  commandActivated: boolean = true;

  private checkArgs(CommandContext: CommandContext): boolean {
    if (CommandContext.args[0]) {
      return true;
    }
    return false;
  }

  async run(CommandContext: CommandContext): Promise<void> {
    if (!this.checkArgs(CommandContext)) {
      CommandContext.message.reply("Arguments is not valid");
      return;
    }
    api
      .getBook(CommandContext.args[0])
      .then(
        (book: {
          title: any;
          id: number;
          uploaded: Date;
          scanlator: string;
          tags: any;
          favorites: number;
          media: number;
        }) => {
          let strTags: string = "";
          let strLanguage: string = "";
          let strCharacter: string = "";
          let strGroup: string = "";
          let strArtist: string = "";
          let strCategory: string = "";
          let strParody: string = "";

          book.tags.map((tag: any) => {
            if (tag.type.type === "tag") {
              strTags = strTags.concat(" `" + tag.name + "`");
            }
            if (tag.type.type === "language") {
              if (tag.name != "translated") {
                strLanguage = strLanguage.concat(" `" + tag.name + "`");
              }
            }
            if (tag.type.type === "character") {
              strCharacter = strCharacter.concat(" `" + tag.name + "`");
            }
            if (tag.type.type === "group") {
              strGroup = strGroup.concat(" `" + tag.name + "`");
            }
            if (tag.type.type === "artist") {
              strArtist = strArtist.concat(" `" + tag.name + "`");
            }
            if (tag.type.type === "category") {
              strCategory = strCategory.concat(" `" + tag.name + "`");
            }
            if (tag.type.type === "parody") {
              strParody = strParody.concat(" `" + tag.name + "`");
            }
          });

          const embed = new MessageEmbed();
          embed.setTitle(book.title.english);
          embed.setURL("https://nhentai.net/g/" + `${book.id}` + "/");
          embed.setColor(15340722);
          embed.setDescription("Get information about a book");
          embed.setFooter(
            "PancakeBot",
            "https://cdn.discordapp.com/app-icons/743447264667762720/2fca95c221b5a3ce4614ea38fa21da0c.png"
          );
          embed.setAuthor(
            "NH Tracker by Kenta",
            "https://nhentai.app/media/nhentailogo.png"
          );
          embed.setThumbnail("https://nhentai.app/media/nhentailogo.png");

          embed.addFields([
            { name: "Id", value: book.id },
            {
              name: "Uploaded",
              value: book.uploaded,
            },
            {
              name: "Fav",
              value: book.favorites,
            },
          ]);
          strParody ? embed.addField("Parodies", strParody) : undefined;
          strCharacter ? embed.addField("Characters", strCharacter) : undefined;
          strTags ? embed.addField("Tags", strTags) : undefined;
          strArtist ? embed.addField("Artists", strArtist) : undefined;
          strGroup ? embed.addField("Groups", strGroup) : undefined;
          strLanguage ? embed.addField("Languages", strLanguage) : undefined;
          strCategory ? embed.addField("Categories", strCategory) : undefined;

          CommandContext.message.channel.send(embed);
        }
      )
      .catch((error: any) => {
        console.log(error);
        CommandContext.message.reply("Error collecting data please try again");
      });
  }
}
