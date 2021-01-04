import fetch, { Response } from "node-fetch";

export class AnilistRequest {
  public apiCall(url: string, variables: any, query: string) {
    let options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        query: query,
        variables: variables,
      }),
    };
    // Make the HTTP Api request
    return fetch(url, options)
      .then(this.handleResponse)
      .then(this.handleData)
      .catch(this.handleError);
  }

  private handleResponse(response: { json: () => Promise<Response>; ok: any }) {
    const json = response.json();
    return response.ok ? json : Promise.reject(json);
  }

  private handleData(data: any): any {
    return data;
  }

  private handleError(error: any) {
    console.error(error);
  }
}
