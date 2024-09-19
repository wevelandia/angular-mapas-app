import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

// Aca pegamos el token de MapBox
import Mapboxgl from 'mapbox-gl'; // or "const mapboxgl = require('mapbox-gl');"

Mapboxgl.accessToken = 'pk.eyJ1Ijoid3ZlbGFuZGlhIiwiYSI6ImNseG5obmk3ZzAzaTEycW9idDk2M3czcDYifQ.PwFVBNVDImgvsV-jJFnlrQ';

// Acá vamos a verificar si no existe navigator.geolocation
if ( !navigator.geolocation ) {
  alert('Navegador no soporta la Geolocation');
  throw new Error('Navegador no soporta la Geolocation');
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
