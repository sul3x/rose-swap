import { Component } from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonRow,
  IonList,
  IonItem,
  IonLabel, IonButton, IonAlert
} from '@ionic/angular/standalone';
import { MyRoseGardenService } from "../../../services/my-rose-garden.service";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonRow, IonList, IonItem, IonLabel, IonButton, IonAlert],
})
export class Tab1Page {
  constructor(public myRoseGardenService: MyRoseGardenService) {}

  public alertButtons = [{}];
  public alertInputs = [{}];

  initializeAlertInput() {
    this.alertButtons = ['OK'];
    this.alertButtons = [
      {
        type: 'button',
        text: 'Photo',
        handler: () => {
          this.myRoseGardenService.addNewPhotoRose();
        }
      },
      {
        text: 'OK:)'
      },
    ];
    this.alertInputs = [
      {
        placeholder: 'Name',
        attributes: {
          maxlength: 8,
        },
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
      },
    ];
  }

}
