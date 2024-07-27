import {Component, ElementRef, ViewChild, AfterViewInit, CUSTOM_ELEMENTS_SCHEMA, OnInit} from '@angular/core';
import { GoogleMap } from '@capacitor/google-maps';
import { environment } from '../../../../environments/environment';
import {IonContent, IonHeader, IonTitle, IonToolbar} from "@ionic/angular/standalone";
import {HeaderComponent} from "../../../shared/components/header/header.component";

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
  newMap: GoogleMap;

  constructor() {
  }

  async ngAfterViewInit() {
    await this.createMap();
  }

  async createMap() {
    console.log('Creating map...');
    try {
      this.newMap = await GoogleMap.create({
        id: 'my-cool-map',
        element: this.mapRef.nativeElement,
        apiKey: environment.apiKey,
        config: {
          center: {
            lat: 33.6,
            lng: -117.9,
          },
          zoom: 8,
        },
      });
      console.log('Map created successfully');
    } catch (error) {
      console.error('Error creating map:', error);
    }
  }
}
