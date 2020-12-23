export type BotConfig = {
  prefix: string;
  activity: string;
  apiUrl: string;
};

export const configBot: BotConfig = {
  prefix: "!",
  activity: "In Dev",
  apiUrl: "https://graphql.anilist.co",
};
