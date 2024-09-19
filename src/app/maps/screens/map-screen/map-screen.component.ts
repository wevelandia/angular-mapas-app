import { Component, OnInit } from '@angular/core';
import { PlacesService } from '../../services';

@Component({
  selector: 'app-map-screen',
  templateUrl: './map-screen.component.html',
  styleUrl: './map-screen.component.css'
})
export class MapScreenComponent {

  // Injectamos aca el servicio de Geolocation
  constructor( private placesService: PlacesService ) {}

  // Vamos a crear un getter para que este pendiente de la propiedades del servicio
  get isUserlocationReady() {
    return this.placesService.isUserLocationReady;
  }

}
