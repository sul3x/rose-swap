import { Component, OnDestroy, OnInit } from '@angular/core';
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
  AlertController,
  LoadingController
} from '@ionic/angular/standalone';
import { MyRoseGardenService } from '../../../services/my-rose-garden.service';
import { IRose } from '../../../model/interfaces';
import { addIcons } from 'ionicons';
import { addOutline, trashOutline, pencilOutline } from 'ionicons/icons';
import { Timestamp } from '@angular/fire/firestore';
import { AuthService } from '../../../services/auth.service';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { PhotoRoseService } from '../../../services/photo-rose.service';
import { NgIf } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonTitle, IonContent, IonRow, IonList, IonItem,
    IonLabel, IonButton, IonAlert, IonInput, IonImg, IonCol, IonCard,
    IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonModal,
    IonButtons, IonFab, IonFabButton, IonIcon, IonThumbnail, NgIf
  ],
})
export class Tab1Page implements OnInit, OnDestroy {
  public myGarden: IRose[] = [];
  protected userId: string;
  private gardenSubscription: Subscription;
  private userIdSubscription: Subscription;

  constructor(
    private myRoseGardenService: MyRoseGardenService,
    private alertCtrl: AlertController,
    private authService: AuthService,
    private alertController: AlertController,
    private photoRoseService: PhotoRoseService,
    private loadingController: LoadingController,
  ) {}

  ngOnInit(): void {
    addIcons({
      addOutline,
      trashOutline,
      pencilOutline
    });

    this.userIdSubscription = this.authService.getUserIdObservable().subscribe((userId) => {
      this.userId = userId;
      if (userId) {
        this.subscribeToGarden();
      } else {
        this.unsubscribeFromGarden();
        this.myGarden = [];
      }
    });
  }
/*
  ionViewWillEnter() {
    if (this.userId) {
      this.subscribeToGarden();
    }
  }

  ionViewWillLeave() {
    this.unsubscribeFromGarden();
  }*/

  ngOnDestroy(): void {
    this.unsubscribeFromGarden();
    if (this.userIdSubscription) {
      this.userIdSubscription.unsubscribe();
    }
  }

  private subscribeToGarden() {
    if (this.gardenSubscription) {
      this.gardenSubscription.unsubscribe();
    }
    this.gardenSubscription = this.myRoseGardenService.getMyGardenFirestore().subscribe(
      (myGarden: IRose[]) => {
        this.myGarden = myGarden;
      },
      (error) => {
        console.error('Error fetching garden data', error);
      }
    );
  }

  private unsubscribeFromGarden() {
    if (this.gardenSubscription) {
      this.gardenSubscription.unsubscribe();
    }
  }

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
            maxlength: 20
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
            maxlength: 58
          }
        }
      ],
      buttons: [
        {
          text: 'Save',
          handler: async (roseData: any) => {
            if (await this.validateInputs(roseData)) {
              const newRose: IRose = {
                imageRoseUrl: 'https://firebasestorage.googleapis.com/v0/b/rose-swap.appspot.com/o/roses%2Fphotobase%2Fmarker-orange-light.svg?alt=media&token=94944928-533e-44db-a025-dae9c030343a',
                name: roseData[0],
                intensityFragrance: roseData[1],
                cuttings: roseData[2],
                moreInfo: roseData[3],
                addedAt: Timestamp.now(),
                userId: this.userId
              };
              await this.myRoseGardenService.addRose(newRose);
            } else {
              console.error('Validation failed');
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
    console.log('User ID at addRose:', this.userId);
  }

  async validateInputs(roseData: any): Promise<boolean> {
    let correct = true;
    const totalMessageError: string[] = [];

    if (!roseData[0] || roseData[0].length < 2 || roseData[0].length > 20) {
      totalMessageError.push('The name of the rose must be between 2 and 20 characters.');
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
    if (!roseData[3] || roseData[3].length < 0 || roseData[3].length > 58) {
      totalMessageError.push('The description must be up to 58 characters.');
      correct = false;
    }

    if (!correct) {
      await this.alertRoseData(totalMessageError.join('\n'));
    } else {
      await this.alertRoseDataOk('Rose data saved. 🌹');
    }

    return correct;
  }

  async changeImageRose(rose: IRose) {
    const imageRose = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt,
    });
    console.log('new image rose: ', imageRose);

    if (imageRose) {
      const loading = await this.loadingController.create();
      await loading.present();

      const result = await this.photoRoseService.uploadImageRose(imageRose, rose);
      await loading.dismiss();

      if (!result) {
        const alert = await this.alertController.create({
          header: 'Upload failed',
          message: 'There was a problem uploading your new photo rose.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    }
  }

  async alertRoseData(totalMessageError: string) {
    const alert = await this.alertController.create({
      header: 'We encountered some issues with your input:',
      message: totalMessageError,
      buttons: [{
        text: 'OK',
        handler: () => {
          alert.dismiss();
        }
      }]
    });
    await alert.present();
  }

  async alertRoseDataOk(messageOk: string) {
    const alert = await this.alertController.create({
      header: 'Congrats',
      message: messageOk,
      buttons: [{
        text: 'OK',
        handler: () => {
          alert.dismiss();
        }
      }]
    });
    await alert.present();
  }

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
            maxlength: 20
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
            maxlength: 58
          }
        }
      ],
      buttons: [
        {
          text: 'Update',
          handler: async (roseData: any) => {
            if (await this.validateInputs(roseData)) {
              const updatedRose: IRose = {
                id: rose.id,
                imageRoseUrl: rose.imageRoseUrl,
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

  deleteRose(rose: IRose) {
    this.myRoseGardenService.deleteRose(rose).then(r => {
      console.log('Rose deleted successfully');
    });
  }

  async deleteRoseAlert(rose: IRose) {
    const alert = await this.alertController.create({
      header: 'Confirmation',
      message: 'Are you sure that you want to delete this rose?',
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
    });
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
    });
    await alert.present();
  }

  async deleteRoseMessageCancel() {
    const alert = await this.alertController.create({
      header: 'No worries :)',
      message: 'Your rose still belongs to your garden. 🌷',
      buttons: [
        {
          text: 'OK',
          handler: () => {
            alert.dismiss();
          }
        }
      ]
    });
    await alert.present();
  }
}
