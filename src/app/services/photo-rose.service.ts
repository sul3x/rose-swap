import { Injectable } from '@angular/core';
import {Auth} from '@angular/fire/auth';
import {doc, docData, Firestore, setDoc} from '@angular/fire/firestore';
import {getDownloadURL, ref, Storage, uploadString} from '@angular/fire/storage';
import {Photo} from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class PhotoRoseService {

  private imageRoseUrl: string;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private storage: Storage
  ) { }

  async uploadImageRose(cameraFile: Photo, idRose: string) {

    console.log('id rose antes del upload: ', idRose);

    const path = `roses/${idRose}/photorose.webp`;
    const storageRef = ref(this.storage, path);

    try {
      await uploadString(storageRef, cameraFile.base64String, "base64");
      const imageRoseUrl = await getDownloadURL(storageRef);
      this.imageRoseUrl = imageRoseUrl;
      return true;
    } catch (e) {
      return null;
    }
  }

  getImageRoseUrl(): string {
    return this.imageRoseUrl;
  }
}
