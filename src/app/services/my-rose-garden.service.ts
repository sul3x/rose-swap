import {Injectable} from '@angular/core';
import {Camera, CameraResultType, CameraSource, Photo} from "@capacitor/camera";
import {IRose} from "../model/interfaces";
import {
  addDoc,
  collection,
  collectionData,
  Firestore
} from "@angular/fire/firestore";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MyRoseGardenService {

  constructor(private firestore: Firestore) {
  }

  /*
  public async addNewPhotoRose(): Promise<Photo> {
    const capturedNewRose: Photo = await Camera.getPhoto({
      resultType: CameraResultType.Uri,
      source: CameraSource.Camera,
      quality: 100
    });
    console.log('Captured new rose photo: ', capturedNewRose);
    return capturedNewRose;
  }*/

  // FIRESTORE GET MYGARDEN
  getMyGardenFirestore(): Observable<IRose[]> {
    const myGardenRef = collection(this.firestore, 'mygarden');
    return collectionData(myGardenRef, { idField: 'id'}) as Observable<IRose[]>;
  }

  // FIRESTORE SAVE NEW ROSE
  addRose(rose: IRose) {
    const myGardenFirestoreRef = collection(this.firestore, 'mygarden');
    return addDoc(myGardenFirestoreRef, rose);
  }
}
