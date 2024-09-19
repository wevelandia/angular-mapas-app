import { Injectable } from '@angular/core';
import { Feature, PlacesResponse } from '../interfaces/places';
import { PlacesApiClient } from '../api';
import { MapService } from './map.service';

// providedIn: 'root': Esto es para que este de manera global en la aplicación.
@Injectable({
  providedIn: 'root'
})
export class PlacesService {

  // Este servicio sera para poder otener nuestra Geolocation, y aca queremos tambien tener nuestros lugares cuando se realiza una busqueda.
  // Definimos dos propiedades
  public userLocation? : [number, number];

  public isLoadingPlaces: boolean = false;

  public places: Feature[] = []; // Este es de la interface de places.ts

  get isUserLocationReady(): boolean {
    // !! : esta doble negación me retorna un true porque se esta realizando una doble negación
    // !this.userLocation Esto me indica que no se tiene una location. Y so lo niego nuevamente es decir que si tiene
    return !!this.userLocation;
  }

  // Por ahora importamos el HttpCliente, para poder realizar la petición
  //constructor( private http:HttpClient ) {
  //  this.getUserlocation();
  //}

  constructor(
    private placesApi: PlacesApiClient,
    private mapService: MapService,
  ) {
    this.getUserlocation();
  }

  // Creamos un metodo para saber cuando tengo una Geolocation y ello lo logramos retornando una promesa.
  public async getUserlocation(): Promise<[number, number]> {
    return new Promise( (resolve, reject) => {
      // navigator.geolocation.watchPosition: Esto retorna posiciones a medida de que se va moviendo
      // Tomamos primero coords.longitude y luego coords.latitude porque MapBox trabaja así que es lo contratio a como lo maneja Google Maps.
      navigator.geolocation.getCurrentPosition(
        ({ coords }) => {
          this.userLocation = [ coords.longitude, coords.latitude ];
          resolve( this.userLocation );
        },
        ( err ) => {
          alert('No se pudo obtener la geolocalización');
          console.log( err );
          reject();
        }
      );
    })
  }

  // Creamos un metodo que recibe el query para poder obtener los sitios que estan alrededor
  // Para mostrar los marques una solución que se puede es hacer que los places sea un Observable que esta emitiendo los lugares y en otros lugares subscribirnos a los cambios.
  getPlacesByQuery( query: string = '' ) {
    //todo: evaluar cuando el query es un string vacio o nulo
    if ( query.length === 0 ) {
      this.isLoadingPlaces = false;
      this.places = [];
      return;
    }

    if ( !this.userLocation ) throw Error('No hay userLocation');

    this.isLoadingPlaces = true; // Aún no obtengo lugares

    this.placesApi.get<PlacesResponse>(`/forward?q=${ query }`, {
      params: {
        proximity: this.userLocation.join(',')
      }
    })
      .subscribe( resp => {
        //console.log( resp.features );
        this.isLoadingPlaces = false; // Aca obtenemos nuevos lugares
        this.places = resp.features;

        this.mapService.createMarkersFromPlaces( this.places, this.userLocation! );
      });
  }

  // Creamos un nuevo metodo para ocultar resultados
  deletePlaces() {
    this.places = [];
  }
}
