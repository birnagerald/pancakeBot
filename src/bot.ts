import { Client, Message } from "discord.js";
import { prefix, activity } from "./config.json";
import { config } from "dotenv";
config();

export class DiscordBot {
  private client: Client;
  private config: any;

  constructor() {
    this.client = new Client();
  }

  public start(): void {
    this.client.on("ready", () => {
      console.log("Bot is ready!");
      if (this.client.user) {
        this.client.user.setActivity(activity);
      }
    });
    this.client.on("error", console.error);
    this.client.on("warn", console.warn);
    this.client.login(process.env.DISCORD_TOKEN);
  }
}
