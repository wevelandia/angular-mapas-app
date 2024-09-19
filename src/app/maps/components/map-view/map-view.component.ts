import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { PlacesService, MapService } from '../../services';
import { Map, Popup, Marker } from 'mapbox-gl';

@Component({
  selector: 'app-map-view',
  templateUrl: './map-view.component.html',
  styleUrl: './map-view.component.css'
})
export class MapViewComponent implements AfterViewInit {

  // Aca tomamos la referencia local de #mapDiv del Html.
  // mapDivElement: Va a ser el nombre de mi variable que tiene la referencia del elememnto div #mapDiv
  @ViewChild('mapDiv')
  mapDivElement?: ElementRef;

  // Inyectamos nuestro servicio de PlacesService y el de Map
  constructor(
    private placesService: PlacesService,
    private mapSercive: MapService,
  ) {}


  // Para ver el mapa debemos de esperar que todo el componente este montado
  // ngAfterViewInit: Despues de que mi Vista ha sido inicilizada.
  ngAfterViewInit(): void {
    // Aca adentro deberiamos de tener la geolocalización del usuario y la referencia del div el cual se creo en el html

    // Aca deberiamos de mostrar el mapa si tenemos Geolocalización.
    if ( !this.placesService.userLocation ) throw Error('No hay placesService.userLocation');

    const map = new Map({
      container: this.mapDivElement?.nativeElement, // Colocamos la referencia al div, o se puede colocar el container Id, solo que es probale que en el HTML se definan muchos div con ese mismo Id.
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.placesService.userLocation, // starting position [lng, lat]
      zoom: 14, // starting zoom
    });


    // Trabajamos con los Popup
    const popup = new Popup()
      .setHTML(`
        <h6>Aquí estoy</h6>
        <span>Estoy en este ligar del mundo</span>
      `);

    // Ahora trabajamos con los markers para mostrar la localización actual.
    new Marker({ color: 'red' })
        .setLngLat( this.placesService.userLocation )
        .setPopup( popup )
        .addTo( map );

    // Aca podemos inicializar el mapa, se establece en el sercivio y ya tenemos el control del mapa.
    this.mapSercive.setMap( map );

  }

}
