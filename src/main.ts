import {enableProdMode} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {PreloadAllModules, provideRouter, RouteReuseStrategy, withPreloading} from '@angular/router';
import {IonicRouteStrategy, provideIonicAngular} from '@ionic/angular/standalone';

import {routes} from './app/app.routes';
import {AppComponent} from './app/app.component';
import {environment} from './environments/environment';
import {provideHttpClient} from "@angular/common/http";
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { defineCustomElements } from '@ionic/pwa-elements/loader';

defineCustomElements(window);

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
  providers: [
    {provide: RouteReuseStrategy, useClass: IonicRouteStrategy},
    provideIonicAngular(),
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(), provideFirebaseApp(() => initializeApp({"projectId":"rose-swap","appId":"1:571055760262:web:2848d24ef94983f6c34207","storageBucket":"rose-swap.appspot.com","apiKey":"AIzaSyBOmLFE0gv9EmHKEufhnIGyGObJx5p--nw","authDomain":"rose-swap.firebaseapp.com","messagingSenderId":"571055760262","measurementId":"G-2BY6HGVKSS"})), provideAuth(() => getAuth())
  ],
});
