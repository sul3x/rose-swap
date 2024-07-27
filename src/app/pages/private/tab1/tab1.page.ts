import { Component, OnInit } from '@angular/core';
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
  IonIcon,
  IonThumbnail
} from '@ionic/angular/standalone';
import { MyRoseGardenService } from "../../../services/my-rose-garden.service";
import { IRose } from "../../../model/interfaces";
import { addIcons } from "ionicons";
import { AlertController } from "@ionic/angular";
import { addOutline } from "ionicons/icons";
import { Timestamp } from "@angular/fire/firestore";
import { AuthService } from "../../../services/auth.service";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonRow, IonList, IonItem, IonLabel, IonButton, IonAlert, IonInput, IonImg, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonModal, IonButtons, IonFab, IonFabButton, IonIcon, IonThumbnail],
})
export class Tab1Page implements OnInit {

  public myGarden: IRose[] = [];


  constructor(
    private platform: Platform,
    private myRoseGardenService: MyRoseGardenService,
    private alertCtrl: AlertController,
    private authService: AuthService
  ) {
    this.platform = platform;
  }

  ngOnInit(): void {
    addIcons({
      addOutline
    });

  }

  ionViewWillEnter() {


    // Fetch the garden
    this.myRoseGardenService.getMyGardenFirestore().subscribe((myGarden: IRose[]) => {
      this.myGarden = myGarden;
    });
  }

  openRose() {
    // Implementation for opening a rose
  }



  async addRose() {
    this.authService.getUserId().subscribe(async userId => {
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
          {
            text: 'Add',
            handler: (roseData: any): void => {
              if (userId) {
                const newRose: IRose = {
                  name: roseData[0],
                  intensityFragrance: roseData[1],
                  cuttings: roseData[2],
                  moreInfo: roseData[3],
                  addedAt: Timestamp.now(),
                  userId: userId
                };
                this.myRoseGardenService.addRose(newRose);
              } else {
                console.error('No user ID found');
              }
            }
          },
          {
            text: 'Cancel',
            role: 'cancel'
          }
        ]
      });
      await alert.present();
      console.log('User ID at addRose:', userId);
    });
  }

}
