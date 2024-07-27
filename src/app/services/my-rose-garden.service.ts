import {Injectable} from '@angular/core';
import {Camera, CameraResultType, CameraSource, Photo} from "@capacitor/camera";
import {IRose, UserProfile} from "../model/interfaces";
import {
  addDoc,
  collection,
  collectionData,
  Firestore, Timestamp, where
} from "@angular/fire/firestore";
import {Observable, switchMap} from "rxjs";
import {query, orderBy} from '@firebase/firestore';
import {AuthService} from "./auth.service";
import {take} from "rxjs/operators";
import {user} from "@angular/fire/auth";

@Injectable({
  providedIn: 'root'
})
export class MyRoseGardenService {

  constructor(private firestore: Firestore,
              private authService: AuthService) {
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
    return this.authService.getUserId().pipe(
      take(1),
      switchMap(userId => {
        const myGardenRef = collection(this.firestore, 'mygarden');
        const myGardenOrderByDesc = query(myGardenRef,
          where('userId', '==', userId),
          orderBy('addedAt', 'desc'));
        return collectionData(myGardenOrderByDesc, { idField: 'id' }) as Observable<IRose[]>;
      })
    );
  }

  // FIRESTORE SAVE NEW ROSE
  addRose(rose) {
    const myGardenFirestoreRef = collection(this.firestore, 'mygarden');
    return addDoc(myGardenFirestoreRef, rose);
  }

  deleteRose(rose) {

  }

  editRose(rose) {

  }
}
