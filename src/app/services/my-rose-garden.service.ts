import {Injectable} from '@angular/core';
import {IRose} from "../model/interfaces";
import {
  addDoc,
  collection,
  collectionData, deleteDoc, doc, docData,
  Firestore, updateDoc, where
} from "@angular/fire/firestore";
import {Observable, switchMap} from "rxjs";
import {query, orderBy} from '@firebase/firestore';
import {AuthService} from "./auth.service";
import {take} from "rxjs/operators";

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
  async addRose(rose: IRose) {
    const myGardenFirestoreRef = collection(this.firestore, 'mygarden');
    return addDoc(myGardenFirestoreRef, rose);
  }

  async deleteRose(rose: IRose): Promise<void> {
    if (!rose.id) {
      throw new Error('Rose ID is required to delete');
    }
    const roseDocRef = doc(this.firestore, `mygarden/${rose.id}`);
    return deleteDoc(roseDocRef);
  }

  getRoseById(id): Observable<IRose> {
    const roseDocRef = doc(this.firestore, `mygarden/${id}`);
    return docData(roseDocRef, { idField: 'id' }) as Observable<IRose>;
  }

  updateRose(rose: IRose ) {
    const roseDocRef = doc(this.firestore, `mygarden/${rose.id}`);
    return updateDoc(roseDocRef, {
      name: rose.name,
      cuttings: rose.cuttings,
      intensityFragrance: rose.intensityFragrance,
      moreInfo: rose.moreInfo
    });
  }
}
