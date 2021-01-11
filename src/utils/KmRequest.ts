// © Contributeurs de la base de données Otaku de Karaoke Mugen 2017-2020 
// - La base de données Otaku de Karaoke Mugen est rendue disponible sous les termes de la Open Database License. 
// Tous les droits associés aux données présentes sont concédés sous la Database Contents License. 
// Vous devriez avoir reçu une copie de ces licences avec la base de données. 
// Le cas échéant, vous pouvez consulter https://opendatacommons.org/licenses/index.html

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
