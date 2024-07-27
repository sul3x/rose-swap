import {Photo} from "@capacitor/camera";
import {Timestamp} from '@angular/fire/firestore';

export interface IRose {
  id?: string;
  //photo: Photo;
  name: string;
  cuttings: number;
  intensityFragrance: number;
  moreInfo: string;
  addedAt?: Timestamp;
  userId?: string;
}


export interface UserProfile {
    id?: string;
    displayName: string;
    email: string;
    birthDate: string;
    city: string;
    aboutMe?: string;
}
