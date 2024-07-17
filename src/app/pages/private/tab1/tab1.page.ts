import {Component, inject, OnInit} from '@angular/core';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonRow,
  IonList,
  IonItem,
  IonLabel, IonButton, IonAlert, IonInput, IonImg, IonCol, Platform
} from '@ionic/angular/standalone';
import { MyRoseGardenService } from "../../../services/my-rose-garden.service";
import {Photo} from "@capacitor/camera";
import {IRose} from "../../../model/interfaces";
import {Directory, Filesystem, ReadFileResult, WriteFileResult} from "@capacitor/filesystem";
import {Capacitor} from "@capacitor/core";

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [IonHeader, IonToolbar, IonTitle, IonContent, IonRow, IonList, IonItem, IonLabel, IonButton, IonAlert, IonInput, IonImg, IonCol],
})

export class Tab1Page implements OnInit {

  public alertButtons: {}[] = [{}];
  public alertInputs:{}[] = [{}];
  public capturedRose: Photo;
  myRoseGardenService: MyRoseGardenService = inject(MyRoseGardenService);
  public myGarden: IRose[] = [];
  private platform: Platform;

  constructor(platform: Platform) {
    this.platform = platform;
  }

  ngOnInit(): void {
    this.getMyGarden();
    console.log('Initialize roses variable');
    this.initializeAlertInput();
  }

  initializeAlertInput(): void {
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
        handler: (rose: IRose) => {
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
    console.log('my garden', this.myGarden);
  }

  saveRose(rose: IRose): void {
    try {
      this.myRoseGardenService.setRose(rose);
      console.log("Registered new rose: ", rose);
    } catch (error) {
      console.error("Error saving rose: ", error)
    }

    try {
      this.getMyGarden();
    } catch (error) {
      console.error("Error getting my garden")
    }
  }

  /*
  // SHOW PHOTO
  private async saveNewPhotoRose(photo: Photo) {
    const base64Data = await this.readAsBase64(photo);

    const fileName: string = Date.now() + '.jpeg';
    const savedFile: WriteFileResult = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: Directory.Data
    });

    if (this.platform.is('hybrid')) {
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri)
      };
    }

    return {
      filepath: fileName,
      webviewPath: photo.webPath
    };
  }

  private async readAsBase64(photo: Photo) {
    if (this.platform.is('hybrid')) {
      const file: ReadFileResult = await Filesystem.readFile({
        path: photo.path!
      });

      return file.data;
    }
    else {

      const response: Response = await fetch(photo.webPath!);
      const blob: Blob = await response.blob();

      return await this.convertBlobToBase64(blob) as string;
    }
  }

  private convertBlobToBase64 = (blob: Blob) => new Promise((resolve, reject) => {
    const reader: FileReader = new FileReader();
    reader.onerror = reject;
    reader.onload = () => {
      resolve(reader.result);
    };
    reader.readAsDataURL(blob);
  });*/
}
