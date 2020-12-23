import fetch, { Response } from "node-fetch";

export class AnilistRequest {
  public apiCall(
    url: string,
    variables: any,
    query: string
  ): Promise<Response> {
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
    console.log(url, options);
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
    console.log(JSON.stringify(data));
  }

  private handleError(error: any) {
    alert("Error, check console");
    console.error(error);
  }
}
// faire une première requète pour trouver le nombre de page total puis en faire une deuxième sur une page random et prendre un anime random sur cette page.
// Nombre d'anime par page : 50
