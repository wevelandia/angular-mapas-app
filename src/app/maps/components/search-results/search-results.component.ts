import { Component } from '@angular/core';
import { MapService, PlacesService } from '../../services';
import { Feature } from '../../interfaces/places';

 @Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
  styleUrl: './search-results.component.css'
})
export class SearchResultsComponent {

  // Creamos una variable para resaltar el Sitio seleccionado
  public selectedId: string = '';

  // Ocupamos el servicio
  constructor(
    private placeService: PlacesService,
    private mapService: MapService,
  ) {}

  // Este metodo es para mostrar el emnsaje que esta Cargando
  get isLoadingPlaces(): boolean {
    return this.placeService.isLoadingPlaces;
  }

  // Obtener los lugares buscados
  get places(): Feature[] {
    return this.placeService.places;
  }

  // Creamos otro metodo para ir al sitio
  flyTo( place: Feature ) {
    this.selectedId = place.id;

    const [ lng, lat ] = place.geometry.coordinates;

    this.mapService.flyTo([ lng, lat ]);
  }

  getDirections( place: Feature ) {
    if ( !this.placeService.userLocation ) throw Error('No hay userLocation');

    // Aca borramos los lugares previos
    this.placeService.deletePlaces();

    const start = this.placeService.userLocation;
    const end = place.geometry.coordinates as [number, number];

    this.mapService.getRouteBetweenPoints(start, end);
  }

}
