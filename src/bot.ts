import { Client, Message } from "discord.js";
import { configBot, BotConfig } from "./configBot";
import { config } from "dotenv";
config();

export class DiscordBot {
  private client: Client;
  private config: BotConfig;

  constructor() {
    this.client = new Client();
    this.config = configBot;
  }

  public start(): void {
    this.client.on("ready", () => {
      console.log("Bot is ready!");
      if (this.client.user) {
        this.client.user.setActivity(this.config.activity);
      }
    });
    this.client.on("error", console.error);
    this.client.on("warn", console.warn);
    this.client.login(process.env.DISCORD_TOKEN);
  }
}
