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

  constructor(
    private router: Router,
    private userProfileService: UserProfileService,
    private geocodingService: GeocodingService
  ) { }

  ngAfterViewInit() {
    this.loadMap();
  }

  private loadMap() {
    const mapOptions: google.maps.MapOptions = {
      center: { lat: 41.3851, lng: 2.1734 },
      zoom: 8,
      mapId: '23f6c636fa364436'
    };

    if (this.mapRef && this.mapRef.nativeElement) {
      this.map = new google.maps.Map(this.mapRef.nativeElement, mapOptions);
      this.infoWindow = new google.maps.InfoWindow();
      this.addUserProfileMarkers();
    }
  }

  private async addUserProfileMarkers() {
    try {
      const userProfiles: UserProfile[] = await this.userProfileService.getUserProfiles();

      for (const profile of userProfiles) {
        try {
          const { lat, lng } = await this.geocodingService.getCoordinates(profile.city).toPromise();

          if (lat && lng) {
            this.addMarker(profile, lat, lng);
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

  private addMarker(profile: UserProfile, lat: number, lng: number) {
    const markerContent = document.createElement('div');
    markerContent.className = 'custom-marker';
    markerContent.innerHTML = `<img src="assets/icon/my-garden-marker-green.svg" alt="${profile.displayName}">`;

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

      const button = infoContent.querySelector(`#info-button-${profile.id}`);
      if (button) {
        button.addEventListener('click', () => {
          console.log(`Button clicked at ${profile.displayName}`);
          this.router.navigate(['/tabs/other-gardens', profile.id]);
        });
      }
    });

    console.log(`Advanced marker added at ${profile.displayName}`);
  }
}
