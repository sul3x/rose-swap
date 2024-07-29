import { Injectable } from '@angular/core';
import {doc, Firestore, setDoc, Timestamp, updateDoc} from '@angular/fire/firestore';
import {getDownloadURL, ref, Storage, uploadString} from '@angular/fire/storage';
import {Photo} from '@capacitor/camera';
import {IRose} from "../model/interfaces";

@Injectable({
  providedIn: 'root'
})
export class PhotoRoseService {

  private imageRoseUrl: string = '';

  constructor(
    private storage: Storage,
    private firestore: Firestore
  ) { }

  async uploadImageRose(cameraFile: Photo, rose: IRose) {

    console.log('rose id before upload image: ', rose.id);
    const path = `roses/${rose.id}/photorose.webp`;
    const storageRef = ref(this.storage, path);

    try {
      await uploadString(storageRef, cameraFile.base64String, "base64");
      const imageRoseUrl = await getDownloadURL(storageRef);
      console.log('imageRoseUrl: ', imageRoseUrl);

      const roseDocRef = doc(this.firestore, `mygarden/${rose.id}`);
      await updateDoc(roseDocRef, {
        imageRoseUrl
      })

      return true;
    } catch (e) {
      console.error('Error uploading image: ', e);
      return null;
    }
  }

  getImageRoseUrl(): string {
    return this.imageRoseUrl;
  }
}
