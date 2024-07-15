import {Injectable} from '@angular/core';
import {Camera, CameraResultType, CameraSource, Photo} from "@capacitor/camera";

@Injectable({
  providedIn: 'root'
})
export class MyRoseGardenService {

  constructor() { }

  public async addNewPhotoRose(): Promise<Photo> {
    const capturedNewRose = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
    return capturedNewRose;
  }

}
