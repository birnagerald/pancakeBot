import fetch, { Response } from "node-fetch";
import https from "https";
import { config } from "dotenv";
config();

export class RiotRequest {
  public async accountApiCall(url: string) {
    let options = {
      method: "GET",
      headers: {
        "X-Riot-Token": `${process.env.RIOT_API_KEY}`,
      },
    };
    try {
      const promise = await fetch(url, options).then((res) => res.json());

      return promise;
    } catch (error) {
      return error;
    }
  }
}
