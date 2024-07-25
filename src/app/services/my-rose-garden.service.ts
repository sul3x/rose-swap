import {Injectable} from '@angular/core';
import {Camera, CameraResultType, CameraSource, Photo} from "@capacitor/camera";
import {IRose} from "../model/interfaces";
import {
  addDoc,
  collection,
  collectionData,
  deleteDoc,
  doc,
  docData,
  Firestore,
  updateDoc
} from "@angular/fire/firestore";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class MyRoseGardenService {

  constructor(private firestore: Firestore) {
    console.log('RosesService initialized');
  }

  getMyGarden() {
    const myGardenLocalStorage: string = window.localStorage.getItem('myGardenLocalStorage');

    if (myGardenLocalStorage) {
      console.log('My garden isn\'t null.');
      const parsedRoses = JSON.parse(myGardenLocalStorage);
      return parsedRoses;
    } else {
      console.log('My garden is null.')
      return [];
    }
  }

  setRose(rose: IRose): void {
    const myGarden: IRose[] = this.getMyGarden();
    const r: IRose = {
      name: rose[0],
      intensityFragrance: rose[1],
      moreInfo: rose[2],
      photo: null,
    };
    myGarden.push(r);
    this.saveMyGarden(myGarden);
    console.log('Updated garden after adding new rose: ', myGarden);
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
    window.localStorage.setItem('myGardenLocalStorage', JSON.stringify(myGarden));
    console.log('Saved garden to local storage: ', myGarden);
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
    console.log('Captured new rose photo: ', capturedNewRose);
    return capturedNewRose;
  }

  // FIRESTORE
  getMyGardenFirestore() {
    const myGardenRef = collection(this.firestore, 'myGarden');
    return collectionData(myGardenRef);
  }

/*
  // FIRESTORE
  getMyGardenFirestore(): Observable<IRose[]> {

    const myGardenFirestoreRef = collection(this.firestore, 'myGardenFirestore');
    return collectionData(myGardenFirestoreRef, {idField: 'id'}) as Observable<IRose[]>;
  }

  getRoseById(id: string): Observable<IRose> {
    const roseDocRef = doc(this.firestore, 'myGardenFirestore/${id}');
    return docData(roseDocRef, { idField: 'id' }) as Observable<IRose>;
  }

  addRose(rose: IRose) {
    const myGardenFirestoreRef = collection(this.firestore, 'myGardenFirestore');
    return addDoc(myGardenFirestoreRef, rose);
  }

  deleteRose(rose: IRose) {
    const roseDocRef = doc(this.firestore, 'myGardenFirestore/${rose.id}');
    return deleteDoc(roseDocRef);
  }

  updateRose(rose: IRose) {
    const roseDocRef = doc(this.firestore, 'myGardenFirestore/${rose.id}');
    return updateDoc(roseDocRef, { ...rose });
  }*/

}
