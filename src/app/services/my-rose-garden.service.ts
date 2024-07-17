import {Injectable} from '@angular/core';
import {Camera, CameraResultType, CameraSource, Photo} from "@capacitor/camera";
import {IRose} from "../model/interfaces";

@Injectable({
  providedIn: 'root'
})
export class MyRoseGardenService {

  constructor() {
    console.log('RosesService initialized');
  }

  getMyGarden(): IRose[] {

    const roses: string = window.localStorage.getItem("roses");

    if (roses) {
      console.log("My garden isn't null.");
      const parsedRoses = JSON.parse(roses);
      return parsedRoses;
    } else {
      console.log("My garden is null.")
      return [];
    }
  }

  setRose(rose: IRose): void {
    const myGarden: IRose[] = this.getMyGarden();

    console.log("Adding new rose: ", rose);

    myGarden.push(rose);
    this.saveMyGarden(myGarden);
  }


  deleteRose(index: number, rose_delete: IRose) {
    const myGarden: IRose[] = this.getMyGarden();
    console.log("Deleting rose: ", rose_delete);
    myGarden.splice(index,1);
    this.saveMyGarden(myGarden);
  }

  saveChangesRose(index: number, modified_rose: IRose) {
    const myGarden: IRose[] = this.getMyGarden();
    myGarden[index] = modified_rose;
    this.saveMyGarden(myGarden);
  }

  private saveMyGarden(myGarden: IRose[]) {
    window.localStorage.setItem('roses', JSON.stringify(myGarden))
  }

  getRoseByIndex(index: number): IRose {
    const myGarden: IRose[] = this.getMyGarden();

    if (index >= 0 && index < myGarden.length) {
      return myGarden[index];
    } else {
      console.error(`Index ${index} is out of bounds for roses array.`);
      return undefined;
    }
  }

  public async addNewPhotoRose(): Promise<Photo> {
    const capturedNewRose: Photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
    return capturedNewRose;
  }

}
