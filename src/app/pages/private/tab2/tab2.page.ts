/// <reference types="@types/google.maps" />
import { Component, ElementRef, ViewChild, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar } from "@ionic/angular/standalone";
import { HeaderComponent } from "../../../shared/components/header/header.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, HeaderComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tab2Page implements AfterViewInit {

  @ViewChild('map') mapRef: ElementRef<HTMLElement>;

  map: google.maps.Map;
  infoWindow: google.maps.InfoWindow;

  locations = [
    { lat: 41.3851, lng: 2.1734, description: 'Barcelona', userId: 'wcYZbzsBkDdKXGBQWFvfccKLvEf2' },
    { lat: 41.9831, lng: 2.8249, description: 'Girona', userId: 'wcYZbzsBkDdKXGBQWFvfccKLvEf2' },
    { lat: 41.1200, lng: 1.2453, description: 'Tarragona', userId: 'wcYZbzsBkDdKXGBQWFvfccKLvEf2' },
    { lat: 41.6176, lng: 0.6200, description: 'Lleida', userId: 'wcYZbzsBkDdKXGBQWFvfccKLvEf2' },
    { lat: 41.5650, lng: 2.0238, description: 'Sabadell', userId: 'wcYZbzsBkDdKXGBQWFvfccKLvEf2' },
    { lat: 41.4720, lng: 2.0843, description: 'Mataró', userId: 'wcYZbzsBkDdKXGBQWFvfccKLvEf2' }
  ];

  constructor(private router: Router) { }

  ngAfterViewInit() {
    this.loadMap();
  }

  loadMap() {
    const mapOptions: google.maps.MapOptions = {
      center: { lat: 41.3851, lng: 2.1734 }, // Center the map on Barcelona
      zoom: 8,
      mapId: '23f6c636fa364436' // Your Map ID here
    };

    this.map = new google.maps.Map(this.mapRef.nativeElement, mapOptions);
    this.infoWindow = new google.maps.InfoWindow();
    this.addAdvancedMarkers();
  }

  addAdvancedMarkers() {
    if (google.maps.marker.AdvancedMarkerElement) {
      console.log('AdvancedMarkerElement is available');
      this.locations.forEach(location => {
        const markerContent = document.createElement('div');
        markerContent.className = 'custom-marker';
        markerContent.innerHTML = `<img src="assets/icon/my-garden-marker-green.svg" alt="${location.description}">`; // Predefined icon path

        const advancedMarker = new google.maps.marker.AdvancedMarkerElement({
          position: { lat: location.lat, lng: location.lng },
          map: this.map,
          content: markerContent
        });

        advancedMarker.addListener('click', () => {
          const infoContent = document.createElement('div');
          infoContent.className = 'info-window';
          infoContent.innerHTML = `
            <h2>${location.description}</h2>
            <p>Latitude: ${location.lat}</p>
            <p>Longitude: ${location.lng}</p>
            <button id="info-button-${location.lat}-${location.lng}">View Garden</button>
          `;
          this.infoWindow.setContent(infoContent);
          this.infoWindow.open(this.map, advancedMarker);

          setTimeout(() => {
            const button = document.getElementById(`info-button-${location.lat}-${location.lng}`);
            if (button) {
              button.addEventListener('click', () => {
                console.log(`Button clicked at ${location.description}`);
                this.router.navigate(['/tabs/other-gardens',location.userId],);
              });
            }
          }, 300); // Adjust the delay as needed
        });

        console.log(`Advanced marker added at ${location.description}`);
      });
    } else {
      console.error('AdvancedMarkerElement is not available');
    }
  }
}
