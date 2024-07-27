import { Injectable } from '@angular/core';
import {addDoc, collection, Firestore} from "@angular/fire/firestore";
import {UserProfile} from "../model/interfaces";

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {

  constructor(private firestore: Firestore) { }

  setUserProfile(userProfile:UserProfile) {
    const userProfileFirestoreRef = collection(this.firestore, 'userprofile');
    return addDoc(userProfileFirestoreRef, userProfile);
  }
}
