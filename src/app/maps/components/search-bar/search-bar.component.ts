import { Component } from '@angular/core';
import { PlacesService } from '../../services';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {

  // Creamos un Debounce manual.
  // Al momento de Colocar a NodeJS y ejecutar la aplicación sale un error de que no encuentra el Namespace NodeJS, para ello se ingresa a tsconfig.app.json y alli en types se coloca entre comillas el valor de "node"
  private debounceTimer?: NodeJS.Timeout;

  // Inyectamos el servicio de places services para enviar la petición de busqueda para cuando digitamos lo que queremos buscar
  constructor( private placesService: PlacesService ) {}

  // Implemenamos el metodo onQueryChanged para el Debounce
  onQueryChanged( query: string = '' ) {
    // Controlamos la manera como se emiten esos valores que se digitan

    // Si se tiene un valor de debounceTimer se limpia
    if ( this.debounceTimer ) clearTimeout( this.debounceTimer );

    this.debounceTimer = setTimeout( () => {

      //console.log( "Mandar este query:", query );
      this.placesService.getPlacesByQuery(query);

    }, 350 );

  }

}
