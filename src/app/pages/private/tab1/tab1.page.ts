import {Component, OnInit} from '@angular/core';
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
  IonCardSubtitle,
  IonCardContent,
  IonModal,
  IonButtons,
  IonFab,
  IonFabButton,
  IonIcon, IonThumbnail
} from '@ionic/angular/standalone';
import { MyRoseGardenService } from "../../../services/my-rose-garden.service";
import {Photo} from "@capacitor/camera";
import {IRose} from "../../../model/interfaces";
import {addIcons} from "ionicons";
import {AlertController} from "@ionic/angular";
import {addOutline} from "ionicons/icons";
import {Timestamp} from "@angular/fire/firestore";


@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonRow, IonList, IonItem, IonLabel, IonButton, IonAlert, IonInput, IonImg, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonModal, IonButtons, IonFab, IonFabButton, IonIcon, IonThumbnail],
})

export class Tab1Page implements OnInit {

  public myGarden: IRose[] = [];

  private platform: Platform;


  constructor(
    platform: Platform,
    private myRoseGardenService: MyRoseGardenService,
    private alertCtrl: AlertController) {
    this.platform = platform;
  }

  ngOnInit(): void {

    addIcons({
      addOutline
    });

  }

  ionViewWillEnter() {
    // FIREBASE
    this.myRoseGardenService.getMyGardenFirestore().subscribe((myGarden: IRose[]) => {
      this.myGarden = myGarden;
    });
  }

  async addRose() {
    const alert = await this.alertCtrl.create({
      header: 'Add Rose',
      inputs: [
        {
          type: 'text',
          placeholder: 'Name'
        },
        {
          type: 'number',
          placeholder: 'Cuttings',
        },
        {
          type: 'number',
          placeholder: 'Fragrance (1 to 10)',
          min: 1,
          max: 10,
        },
        {
          type: 'textarea',
          placeholder: 'Description',
        }
      ],
      buttons: [
        /*{
          text: 'Photo New Rose',
          handler: async (): Promise<boolean> => {
            this.capturedRose = await this.myRoseGardenService.addNewPhotoRose();
            return false;
          }
        },*/
        {
          text: 'Add',
          handler: (rose: IRose): void => {
            this.myRoseGardenService.addRose({
              name: rose[0],
              intensityFragrance: rose[1],
              cuttings: rose[2],
              moreInfo: rose[3],
              addedAt: Timestamp.now()
            });
          }
        },
        {
          text: 'Cancel',
          role: 'cancel'
        }
      ]
    });
    await alert.present();
  }

}
