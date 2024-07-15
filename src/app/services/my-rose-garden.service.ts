import {Injectable} from '@angular/core';
import {Camera, CameraResultType, CameraSource} from "@capacitor/camera";

@Injectable({
  providedIn: 'root'
})
export class MyRoseGardenService {

  constructor() { }

  public async addNewPhotoRose() {
    const capturedNewRose = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    })
  }

}
