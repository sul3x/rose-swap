import {Component, inject, OnInit} from '@angular/core';
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
import {IRose} from "../../../model/interfaces";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonRow, IonList, IonItem, IonLabel, IonButton, IonAlert, IonInput],
})

export class Tab1Page implements OnInit {

  public alertButtons = [{}];
  public alertInputs = [{}];
  public capturedRose: Photo;
  myRoseGardenService: MyRoseGardenService = inject(MyRoseGardenService);
  myGarden: IRose[] = [];

  constructor() {}

  ngOnInit() {
    console.log('Initialize roses variable');
    this.initializeAlertInput();
  }

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
          this.saveRose(data);
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

  getMyGarden() {
    this.myGarden = this.myRoseGardenService.getMyGarden();
  }

  saveRose(rose: IRose) {
    console.log("Register new rose: ", rose)

    try {
      this.myRoseGardenService.setRose(rose);
    } catch (error) {
      console.error("Error saving rose: ", error)
    }

    try {
      this.getMyGarden();
    } catch (error) {
      console.error("Error showing my garden.")
    }
  }
}
