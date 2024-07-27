import { Injectable } from '@angular/core';
import { addDoc, collection, doc, Firestore, getDoc, setDoc } from "@angular/fire/firestore";
import { UserProfile } from "../model/interfaces";

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  constructor(private firestore: Firestore) {}

  async getUserProfile(userId: string): Promise<UserProfile> {
    const userProfileDocRef = doc(this.firestore, `userprofile/${userId}`);
    const userProfileDoc = await getDoc(userProfileDocRef);
    return userProfileDoc.exists() ? (userProfileDoc.data() as UserProfile) : null;
  }

  async setUserProfile(userProfile: UserProfile) {
    const userProfileDocRef = doc(this.firestore, `userprofile/${userProfile.id}`);
    return setDoc(userProfileDocRef, userProfile, { merge: true });
  }
}
