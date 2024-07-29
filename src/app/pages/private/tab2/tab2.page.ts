/// <reference types="@types/google.maps" />
import { Component, ElementRef, ViewChild, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IonContent, IonHeader, IonTitle, IonToolbar } from "@ionic/angular/standalone";
import { HeaderComponent } from "../../../shared/components/header/header.component";
import { Router } from "@angular/router";
import { UserProfileService } from "../../../services/user-profile.service";
import { UserProfile } from "../../../model/interfaces";
import { GeocodingService } from "../../../services/geocoding-service.service";

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, HeaderComponent],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class Tab2Page implements AfterViewInit {

  @ViewChild('map', { static: false }) mapRef: ElementRef<HTMLElement>;

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

  constructor(
    private router: Router,
    private userProfileService: UserProfileService,
    private geocodingService: GeocodingService // Inject GeocodingService
  ) { }

  ngAfterViewInit() {
    this.loadMap();
  }

  loadMap() {
    const mapOptions: google.maps.MapOptions = {
      center: { lat: 41.3851, lng: 2.1734 }, // Center the map on Barcelona
      zoom: 8,
      mapId: '23f6c636fa364436' // Your Map ID here
    };

    if (this.mapRef && this.mapRef.nativeElement) {
      this.map = new google.maps.Map(this.mapRef.nativeElement, mapOptions);
      this.infoWindow = new google.maps.InfoWindow();
      // Commented out the addAdvancedMarkers call as requested
      // this.addAdvancedMarkers();
      this.addUserProfileMarkers();
    }
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
                this.router.navigate(['/tabs/other-gardens', location.userId]);
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

  async addUserProfileMarkers() {
    try {
      const userProfiles: UserProfile[] = await this.userProfileService.getUserProfiles();

      for (const profile of userProfiles) {
        try {
          const { lat, lng } = await this.geocodingService.getCoordinates(profile.city).toPromise();

          // Check if the coordinates are valid before adding the marker
          if (lat && lng) {
            const markerContent = document.createElement('div');
            markerContent.className = 'custom-marker';
            markerContent.innerHTML = `<img src="assets/icon/my-garden-marker-green.svg" alt="${profile.displayName}">`; // Predefined icon path

            const advancedMarker = new google.maps.marker.AdvancedMarkerElement({
              position: { lat, lng },
              map: this.map,
              content: markerContent
            });

            advancedMarker.addListener('click', () => {
              const infoContent = document.createElement('div');
              infoContent.className = 'info-window';
              infoContent.innerHTML = `
                <h2>${profile.displayName}</h2>
                <p>Address: ${profile.city}</p>
                <p>About me: ${profile.aboutMe}</p>
                <button id="info-button-${profile.id}">View Garden</button>
              `;
              this.infoWindow.setContent(infoContent);
              this.infoWindow.open(this.map, advancedMarker);

              setTimeout(() => {
                const button = document.getElementById(`info-button-${profile.id}`);
                if (button) {
                  button.addEventListener('click', () => {
                    console.log(`Button clicked at ${profile.displayName}`);
                    this.router.navigate(['/tabs/other-gardens', profile.id]);
                  });
                }
              }, 300); // Adjust the delay as needed
            });

            console.log(`Advanced marker added at ${profile.displayName}`);
          } else {
            console.warn(`Invalid coordinates for profile: ${profile.displayName}`);
          }
        } catch (error) {
          console.error(`Error fetching coordinates for ${profile.city}:`, error);
        }
      }
    } catch (error) {
      console.error('Error fetching user profiles:', error);
    }
  }


}
