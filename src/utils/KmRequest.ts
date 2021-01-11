import fetch, { Response } from "node-fetch";
interface Data {
  infos: object;
  content: Array<object>;
  error: Error;
}
export class KmRequest {
  public async apiCall(url: string): Promise<Data> {
    let options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      mode: "cors",
      cache: "default",
    };

    try {
      const result = await fetch(url, options);
      const data: Data = await result.json();
      return data;
    } catch (error) {
      return error;
    }
  }
}
