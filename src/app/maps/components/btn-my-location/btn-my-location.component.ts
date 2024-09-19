import { Component } from '@angular/core';
import { MapService, PlacesService } from '../../services';

@Component({
  selector: 'app-btn-my-location',
  templateUrl: './btn-my-location.component.html',
  styleUrl: './btn-my-location.component.css'
})
export class BtnMyLocationComponent {

  // Inyectamos el sercivio MapService y PlacesService porque aca estan mis coordenadas
  constructor(
    private placeService: PlacesService,
    private mapService: MapService
  ) {}

  // Este componente se creo para que cuando se toque nos lleve a la posición inicial del mapa
  goToMyLocation() {
    //console.log('ir a mi ubicación');
    // Realizamos primero una validación, si no tengo localización para mostrar un mensaje
    if ( !this.placeService.isUserLocationReady ) throw Error('No hay ubicación de usuario');
    // Si no esta listo el mapa
    if ( !this.mapService.isMapReady ) throw Error('No hay mapa disponible');

    // Aca navegamos allugar de mi ubicación
    this.mapService.flyTo( this.placeService.userLocation! );
  }

}
