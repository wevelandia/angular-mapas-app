import { HttpClient, HttpHandler, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

// Creamos un Cliente personalizado Http y esto me va a permitir centralizar todas las peticiones que van a ese API.  Esto es como un servicio y me reemplaza el Inject del HttpClient
@Injectable({
  providedIn: 'root',
})
export class PlacesApiClient extends HttpClient {

  // Aca se pueden definir ciertas constantes
  public baseUrl: string = 'https://api.mapbox.com/search/geocode/v6';

  constructor( handler: HttpHandler ) {
    // Esto va a permitir manejar las peticiones como de costumbre asi .gte .put
    super(handler);
  }

  // Sobreescribimos el metodo get
  public override get<T>( url: string, options: {
    params?: HttpParams | {
        [param: string]: string | number | boolean | ReadonlyArray<string | number | boolean>;
    };
  }) {

    url = this.baseUrl + url;

    // super.get esta haciendo el llamado de this.http.get
    // Aca adicionamos tambien los parametros
    // URL para Postman: https://api.mapbox.com/search/geocode/v6/forward?q=Poas&proximity=-74.1612488225436%2C4.698702706033487&language=es&access_token=pk.eyJ1Ijoid3ZlbGFuZGlhIiwiYSI6ImNrZXhobmlsYjA1YjYzMnBibW95Z291eDMifQ.sx3sEzsyedauVXA6wGL_ng
    return super.get<T>( url, {
      params: {
        limit: 5,
        language: 'es',
        access_token: environment.apiKey,
        ...options.params
      }
    });

  }

}
