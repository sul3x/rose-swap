import {Component, inject, OnInit} from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonRow,
  IonList,
  IonItem,
  IonLabel,
  IonButton,
  IonAlert,
  IonInput,
  IonImg,
  IonCol,
  Platform,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle, IonCardContent
} from '@ionic/angular/standalone';
import { MyRoseGardenService } from "../../../services/my-rose-garden.service";
import {Photo} from "@capacitor/camera";
import {IRose} from "../../../model/interfaces";


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonRow, IonList, IonItem, IonLabel, IonButton, IonAlert, IonInput, IonImg, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent],
})

export class Tab1Page implements OnInit {

  public alertButtons: {}[] = [{}];
  public alertInputs:{}[] = [{}];
  public capturedRose: Photo;
  public myGarden: IRose[] = [];
  private platform: Platform;

  constructor(platform: Platform, private myRoseGardenService: MyRoseGardenService) {
    this.platform = platform;


  }

  ngOnInit(): void {
    console.log('Initialize myGarden variable');
    this.getMyGarden();
    this.initializeAlertInput();
  }

  ionViewWillEnter() {
    // FIREBASE
    this.myRoseGardenService.getMyGardenFirestore().subscribe((myGarden: IRose[]) => {
      console.log('firestore getMyGardenFirestore', myGarden);
      this.myGarden = myGarden;
    });
  }

  initializeAlertInput(): void {
    this.alertButtons = [
      {
        text: 'Photo',
        handler: async (): Promise<boolean> => {
          this.capturedRose = await this.myRoseGardenService.addNewPhotoRose();
          return false;
        }
      },
      {
        text: 'OK:)',
        handler: (rose: IRose): void => {
          console.log('Alert input values: ', rose);
          rose.photo = this.capturedRose;
          this.saveRose(rose);
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


  getMyGarden(): void {
    this.myGarden = this.myRoseGardenService.getMyGarden();
  }

  saveRose(rose: IRose): void {
    try {
      console.log('My Garden before add new rose: ', this.myGarden);
      this.myRoseGardenService.setRose(rose);
      this.getMyGarden();
    } catch (error) {
      console.error('Error saving rose: ', error);
    }

    try {
      this.getMyGarden();
    } catch (error) {
      console.error('Error getting my garden');
    }
  }



}
