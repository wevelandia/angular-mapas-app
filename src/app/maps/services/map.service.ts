import { Injectable } from '@angular/core';
import { LngLatBounds, LngLatLike, Map, Marker, Popup, SourceSpecification } from 'mapbox-gl';
import { Feature } from '../interfaces/places';
import { DirectionsApiClient } from '../api';
import { DirectionsResponse, Route } from '../interfaces/directions';

@Injectable({
  providedIn: 'root'
})
export class MapService {

  // Este servicio nos sirve para conrolar el mapa dentro de toda la aplicación

  // Creamos una propiedad para que se quien nos controla el mapa.
  private map?: Map;

  // Creamos una propiedad para los marker
  private markers: Marker[] = [];

  get isMapReady() {
    return !!this.map;  // Si tiene un valor esto va a ser True.
  }

  // Ceamos el constructor e inyectamos DirectionsApiClient que se usa para la polilinea
  constructor( private directionsApi: DirectionsApiClient ) {}

  // Aca se define este metodo para establecer el mapa y que no se haga desde afuera
  setMap( map: Map ) {
    this.map = map;
  }

  // Se crea este metodo para movernos a cualquier sitio en el mapa
  flyTo( coords: LngLatLike ) {
    // Antes de movernos a otro sitio en el mapa debemos de verificar si esta inicializado el mapa
    if ( !this.isMapReady ) throw Error('El mapa no esta inicializado');

    // flyTo: Este es un metodo que ya viene definido en MapBox.
    this.map?.flyTo({
      zoom: 14,
      center: coords,
    });

  }

  // Creamos un nuevo metodo para crear los marcadores de los lugares
  createMarkersFromPlaces( places: Feature[], userLocation: [ number, number] ) {
    // Si el mapa no existe
    if ( !this.map ) throw Error('Mapa no inicializado');

    // Nos aseguramos de borrar los markers por si antes habian, para que cuando se realice una nueva busqueda me visualice los nuevos
    this.markers.forEach( marker => marker.remove() );

    //Ahora se tiene que barrer cada uno de los lugares y crear los marcadores.
    const newMarkers= [];

    for (const place of places) {
      const [ lng, lat ] = place.geometry.coordinates;
      const popup = new Popup()
        .setHTML(`
          <h6>${ place.properties.name }</h6>
          <span>${ place.properties.name_preferred }</span>
        `);
      const newMarker = new Marker()
          .setLngLat([lng,lat])
          .setPopup( popup )
          .addTo( this.map );

      newMarkers.push( newMarker );
    }

    this.markers = newMarkers;

    // Si no hay lugares no hacemos nada más.
    if ( places.length === 0 ) return;

    // Aca vamos a ajustar el mapa para que se visualicen todos los marcadores cuando se realiza una consulta y para ello usamos fitBounds

    // Limites del mapa
    const bounds = new LngLatBounds();
    newMarkers.forEach( marker => bounds.extend( marker.getLngLat() ) );
    bounds.extend( userLocation );

    // Se le añade un padding en el segundo paraetro
    this.map.fitBounds( bounds, {
      padding: 200
    } );

  }

  // Creamos un par de metodos para usar directionsApi
  /* getRouteBetweenPoints( start: [number, number], end: [number, number] ) {
    this.directionsApi.get<DirectionsResponse>(`/${ start.join(',') };${ end.join(',') }`)
      .subscribe( resp => console.log(resp) );
  } */

  // Se le envia aca resp.routes[0] que es donde tenemos la rura y siempre va a estar en la posición cero
  getRouteBetweenPoints( start: [number, number], end: [number, number] ) {
    this.directionsApi.get<DirectionsResponse>(`/${ start.join(',') };${ end.join(',') }`)
      .subscribe( resp => this.drawPolyLine( resp.routes[0] ) );
  }

  // Creamos un metodo para dibujar una PolyLine
  private drawPolyLine( route: Route) {
    // route.distance: Distancia de un sitio a otro - Esta en metros y se dicien en 1000 para pasarla a Kms
    // route.duration: Tiempo que tarde de un sitio a otro - Esta en horas y se divie en 60 para pasar la a minutos
    console.log({ kms: route.distance / 1000, duration: route.duration / 60 });

    // Vuelvo a poner los bounds para que muestre todos los marker
    // En bounds incluimos todos los puntos que muestra de la ruta
    if ( !this.map ) throw Error('Mapa no inicializado');

    const coords = route.geometry.coordinates;
    const start = coords[0] as [number, number];

    const bounds = new LngLatBounds();
    // Insertamos todos los puntos
    // Desestructuramos de la coordenada los valores de lng y lat
    coords.forEach( ([ lng, lat ]) => {
      bounds.extend([ lng, lat ]);
    });

    // Esto es para imprimir las coordenadas y ver que funciona la desestructuración
    /* coords.forEach( ([ lng, lat ]) => {
      console.log([ lng, lat ]);
    }); */

    this.map?.fitBounds( bounds, {
      padding: 200
    } );

    // A partir de aca vamos a dibujar la PolyLine (Google) LineString (Mapbox).
    // AnySourceData ya esta deprecado, y ahora se usa es SourceSpecification
    /* const sourceData: AnySourceData = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coords,
            }
          }
        ]
      }
    } */

    const sourceData: SourceSpecification = {
      type: 'geojson',
      data: {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: {
              type: 'LineString',
              coordinates: coords, // Asegúrate de que 'coords' esté definido con tus coordenadas
            }
          }
        ]
      }
    };

    // Todo: limpiar ruta previa
    // Si el mapa tiene un LineString o Pilyline llamado RouteString la borramos
    if ( this.map.getLayer('RouteString') ) {
      this.map.removeLayer('RouteString'); // Removemos la rura
      this.map.removeSource('RouteString'); // Removemos los datos de las coordenadas
    }

    // Aca se añade al mapa
    // Si se desean añadir mas polyline se debe de hacer pero no con el nombre de RouteString sino un nombre que identidique las diferentes lineas
    //this.map.addSource('RouteString', sourceData);
    // Como AnySourceData ya esta deprecado ahora se realiza el llamado así:
    this.map.addSource('RouteString', sourceData);

    // Aca se le asigna un color y otros estilos
    this.map.addLayer({
      id: 'RouteString', // Este id puede ser otro nombre
      type: 'line',
      source: 'RouteString', // Este nombre si debe de ser igual al addSource
      layout: {
        "line-cap": 'round', // Bordes redondeados
        "line-join": 'round',
      },
      paint: {
        "line-color": "red",
        "line-width": 3,
      }
    });

  }
}
