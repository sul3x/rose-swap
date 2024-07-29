import { Injectable } from '@angular/core';
import {Auth} from '@angular/fire/auth';
import {doc, docData, Firestore} from '@angular/fire/firestore';
import {getDownloadURL, ref, Storage, uploadString} from '@angular/fire/storage';
import {Photo} from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class PhotoAvatarService {

  private imageUrl: string;

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private storage: Storage
  ) { }

  getUserProfileData() {
    const user = this.auth.currentUser;
    const userDocRef = doc(this.firestore, `userprofile/${user.uid}`);
    return docData(userDocRef);
  }

  async uploadImage(cameraFile: Photo) {
    const user = this.auth.currentUser;
    const path = `avatars/${user.uid}/photoavatar.webp`;
    const storageRef = ref(this.storage, path);

    try {
      await uploadString(storageRef, cameraFile.base64String, "base64");

      const imageUrl = await getDownloadURL(storageRef);
      console.log('image url: ', imageUrl);
      this.imageUrl = imageUrl;
      return true;
    } catch (e) {
      return null;
    }
  }
}
