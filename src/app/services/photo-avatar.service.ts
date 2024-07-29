import { Injectable } from '@angular/core';
import {Auth} from '@angular/fire/auth';
import {doc, docData, Firestore} from '@angular/fire/firestore';
import {ref, Storage} from '@angular/fire/storage';
import {Photo} from '@capacitor/camera';

@Injectable({
  providedIn: 'root'
})
export class PhotoAvatarService {

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
  }
}
