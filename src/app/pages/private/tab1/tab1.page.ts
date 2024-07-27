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
  IonThumbnail,
  AlertController
} from '@ionic/angular/standalone';
import { MyRoseGardenService } from "../../../services/my-rose-garden.service";
import { IRose } from "../../../model/interfaces";
import { addIcons } from "ionicons";
import { addOutline, trashOutline, pencilOutline } from "ionicons/icons";
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
  protected userId;

  constructor(
    private platform: Platform,
    private myRoseGardenService: MyRoseGardenService,
    private alertCtrl: AlertController,
    private authService: AuthService,
    private alertController: AlertController
  ) {
    this.platform = platform;
  }

  ngOnInit(): void {

    addIcons({
      addOutline,
      trashOutline,
      pencilOutline
    });

    this.authService.getUserId().subscribe(userId => {
      this.userId = userId
    })
  }

  ionViewWillEnter() {
    // Fetch the garden
    this.myRoseGardenService.getMyGardenFirestore().subscribe((myGarden: IRose[]) => {
      this.myGarden = myGarden;
    });
  }

  async addRose() {
    this.authService.getUserId().subscribe(async userId => {
      const alert = await this.alertCtrl.create({
        header: 'Add Rose',
        inputs: [
          {
            type: 'text',
            placeholder: 'Name',
            attributes: {
              required: true,
              minlength: 2,
              maxlength: 12
            }
          },
          {
            type: 'number',
            placeholder: 'Cuttings',
            attributes: {
              required: true,
              max: 100
            }
          },
          {
            type: 'number',
            placeholder: 'Fragrance (0 to 10)',
            attributes: {
              max: 10
            }
          },
          {
            type: 'textarea',
            placeholder: 'Description',
            attributes: {
              required: true,
              maxlength: 30
            }
          }
        ],
        buttons: [
          {
            text: 'Add',
            handler: (roseData: any): void => {
              if (!this.validateInputs(roseData)) {
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
                  console.log('rose userId: ', newRose.userId)
                } else {
                  console.error('No user ID found');
                }
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

  async validateInputs(roseData: IRose) {

    if (!roseData.name || roseData.name.length < 2 || roseData.name.length > 12) {
      await this.alertRoseDataName();
      return false;
    }
    if (!roseData.cuttings || roseData.cuttings < 0 || roseData.cuttings > 100) {
      await this.alertRoseDataCuttings();
      return false;
    }
    if (!roseData.intensityFragrance || roseData.intensityFragrance < 0 || roseData.intensityFragrance > 10) {
      await this.alertRoseDataFragrance();
      return false;
    }
    if (!roseData.moreInfo || roseData.moreInfo.length > 30) {
      await this.alertRoseDataMoreInfo();
      return false;
    }

    return true;
  }

  async alertRoseDataName() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Please insert rose name (2 to 12 characters).',
      buttons: [{
        text: 'OK',
        handler: () => {
          alert.dismiss()
        }
      }]
    })
    await alert.present();
  }

  async alertRoseDataFragrance() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Please insert intensity of fragrance (0 to 10)',
      buttons: [{
        text: 'OK',
        handler: () => {
          alert.dismiss()
        }
      }]
    })
    await alert.present();
  }

  async alertRoseDataCuttings() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Please insert number of cuttings (0 to 100)',
      buttons: [{
        text: 'OK',
        handler: () => {
          alert.dismiss()
        }
      }]
    })
    await alert.present();
  }

  async alertRoseDataMoreInfo() {
    const alert = await this.alertController.create({
      header: 'Error',
      message: 'Please insert more info (max 30 characters)',
      buttons: [{
        text: 'OK',
        handler: () => {
          alert.dismiss();
        }
      }]
    });
    await alert.present();
  }

  editRose(rose: IRose) {

  }

  deleteRose(rose: IRose) {
    this.myRoseGardenService.deleteRose(rose).then(r => {
      console.log("Rose deleted successfully");
    });
  }
}
