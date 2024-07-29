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
import {addOutline, trashOutline, pencilOutline, rose} from "ionicons/icons";
import { Timestamp } from "@angular/fire/firestore";
import { AuthService } from "../../../services/auth.service";
import {async} from "rxjs";

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

    this.userId = this.authService.getUserId();
  }

  ionViewWillEnter() {
    // Fetch the garden
    this.myRoseGardenService.getMyGardenFirestore().subscribe((myGarden: IRose[]) => {
      this.myGarden = myGarden;
    });
  }

  // add new rose
  async addRose() {

      if (!this.userId) {
        console.error('No user ID found.');
        return;
      }

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
            handler: async (roseData: any) => {
              if (await this.validateInputs(roseData)) {
                const newRose: IRose = {
                  id: this.myRoseGardenService.generateRoseId(),
                  name: roseData[0],
                  intensityFragrance: roseData[1],
                  cuttings: roseData[2],
                  moreInfo: roseData[3],
                  addedAt: Timestamp.now(),
                  userId: this.userId
                };
                await this.myRoseGardenService.addRose(newRose);
                console.log('rose userId: ', newRose.userId);
                console.log('roseId: ', newRose.id)
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
      console.log('User ID at addRose:', this.userId)};

  async validateInputs(roseData) {

    let correct = true;
    let totalMessageError: string[] = [];

    if (!roseData[0] || roseData[0].length < 2 || roseData[0].length > 12) {
      totalMessageError.push('The name of the rose must be between 2 and 12 characters.');
      correct = false;
    }
    if (!roseData[1] || roseData[1] < 0 || roseData[1] > 100) {
      totalMessageError.push('The number of cuttings must be between 0 and 100.');
      correct = false;
    }
    if (!roseData[2] || roseData[2] < 0 || roseData[2] > 10) {
      totalMessageError.push('The intensity of fragrance must be between 0 and 10.');
      correct = false;
    }
    if (!roseData[3] || roseData[3] < 0 || roseData[3] > 30) {
      totalMessageError.push('The description must be up to 30 characters.');
      correct = false;
    }

    if (!correct) {
      await this.alertRoseData(totalMessageError.join('\n'));
    } else {
      await this.alertRoseDataOk('Rose data saved. 🌹')
    }

    return correct;

  }

  async alertRoseData(totalMessageError) {
    const alert = await this.alertController.create({
      header: 'We encountered some issues with your input:',
      message: totalMessageError,
      buttons: [{
        text: 'OK',
        handler: () => {
          alert.dismiss()
        }
      }]
    })
    await alert.present();
  }

  async alertRoseDataOk(messageOk: string) {
    const alert = await this.alertController.create({
      header: 'Congrats',
      message: messageOk,
      buttons: [{
        text: 'OK',
        handler: () => {
          alert.dismiss()
        }
      }]
    })
    await alert.present();
  }

  // update rose
  async updateRose(rose: IRose) {

      const alert = await this.alertCtrl.create({
        header: 'Update Rose',
        inputs: [
          {
            type: 'text',
            placeholder: 'Name',
            value: rose.name,
            attributes: {
              required: true,
              minlength: 2,
              maxlength: 12
            }
          },
          {
            type: 'number',
            placeholder: 'Cuttings',
            value: rose.cuttings,
            attributes: {
              required: true,
              max: 100
            }
          },
          {
            type: 'number',
            placeholder: 'Fragrance (0 to 10)',
            value: rose.intensityFragrance,
            attributes: {
              max: 10
            }
          },
          {
            type: 'textarea',
            placeholder: 'Description',
            value: rose.moreInfo,
            attributes: {
              required: true,
              maxlength: 30
            }
          }
        ],
        buttons: [
          {
            text: 'Update',
            handler: async (roseData: any) => {
              if (await this.validateInputs(roseData)) {
                const updatedRose: IRose = {
                  name: roseData[0],
                  intensityFragrance: roseData[1],
                  cuttings: roseData[2],
                  moreInfo: roseData[3],
                  addedAt: Timestamp.now(),
                  userId: this.userId
                };
                await this.myRoseGardenService.updateRose(updatedRose);
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

  }

  // delete rose
  deleteRose(rose: IRose) {
    this.myRoseGardenService.deleteRose(rose).then(r => {
      console.log("Rose deleted successfully");
    });
  }

  async deleteRoseAlert(rose: IRose) {
    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: '¿Are you sure that you want to delete this rose?',
      buttons: [
        {
          text: 'Yes',
          handler: () => {
            this.deleteRose(rose);
            this.deleteRoseMessageOk();
          }
        },
        {
          text: 'No',
          handler: () => {
            this.deleteRoseMessageCancel();
            alert.dismiss();
          }
        }]
    })
    await alert.present();
  }

  async deleteRoseMessageOk() {
    const alert = await this.alertController.create({
      header: 'Rose deleted',
      message: 'This rose is no longer in your garden.',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            alert.dismiss();
          }
        }
      ]
    })
    await alert.present();
  }

  async deleteRoseMessageCancel() {
    const alert = await this.alertController.create({
      header: 'No worries:)',
      message: 'Your rose still belongs to your garden. 🌷',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            alert.dismiss();
          }
        }
      ]
    })
    await alert.present();
  }
}
