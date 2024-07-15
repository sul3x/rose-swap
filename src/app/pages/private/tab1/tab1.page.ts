import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonRow,
  IonList,
  IonItem,
  IonLabel, IonButton, IonAlert, IonInput
} from '@ionic/angular/standalone';
import { MyRoseGardenService } from "../../../services/my-rose-garden.service";
import {Photo} from "@capacitor/camera";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonRow, IonList, IonItem, IonLabel, IonButton, IonAlert, IonInput],
})
export class Tab1Page {
  constructor(public myRoseGardenService: MyRoseGardenService) {}

  public alertButtons = [{}];
  public alertInputs = [{}];
  public capturedRose: Photo;

  initializeAlertInput() {
    this.alertButtons = [
      {
        text: 'Photo',
        handler: async () => {
          this.capturedRose = await this.myRoseGardenService.addNewPhotoRose();
          return false;
        }
      },
      {
        text: 'OK:)',
        handler: (data) => {
          data.image = this.capturedRose;
          this.saveNewRoseInput(data);
          this.capturedRose = null;
        }
      },
    ];
    this.alertInputs = [
      {
        placeholder: 'Name',
      },
      {
        type: 'number',
        placeholder: 'Fragrance (1 to 10)',
        min: 1,
        max: 10,
      },
      {
        type: 'textarea',
        placeholder: 'A little more about the rose',
      }
    ];
  }

  public userNewRoseEntries: any[] = [];

  saveNewRoseInput(data: any) {
    this.userNewRoseEntries.push(data);
    console.log('new rose inputs: ', this.userNewRoseEntries);
  }
}
