import { HttpClient, HttpHandler } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { environment } from "../../../environments/environment";

// Creamos un Cliente personalizado Http y esto me va a permitir centralizar todas las peticiones que van a ese API.  Esto es como un servicio y me reemplaza el Inject del HttpClient
@Injectable({
  providedIn: 'root',
})
export class DirectionsApiClient extends HttpClient {

  // Aca se pueden definir ciertas constantes
  public baseUrl: string = 'https://api.mapbox.com/directions/v5/mapbox/driving';

  constructor( handler: HttpHandler ) {
    // Esto va a permitir manejar las peticiones como de costumbre asi .gte .put
    super(handler);
  }

  // Sobreescribimos el metodo get
  public override get<T>( url: string ) {

    url = this.baseUrl + url;

    // super.get esta haciendo el llamado de this.http.get
    // Aca adicionamos tambien los parametros, estos se pueden tomar de postamn de la URL completa
    // URL para Postman:  https://api.mapbox.com/directions/v5/mapbox/driving/-74.151607%2C40.768949%3B-74.045125%2C40.778084?alternatives=false&geometries=geojson&language=en&overview=full&steps=true&access_token=pk.eyJ1Ijoid3ZlbGFuZGlhIiwiYSI6ImNrZXhobmlsYjA1YjYzMnBibW95Z291eDMifQ.sx3sEzsyedauVXA6wGL_ng
    return super.get<T>( url, {
      params: {
        alternatives: false,
        geometries: 'geojson',
        language: 'es',
        overview: 'simplified',
        steps: false,
        access_token: environment.apiKey
      }
    });

  }

}
