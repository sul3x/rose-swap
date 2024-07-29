import {Timestamp} from '@angular/fire/firestore';

export interface IRose {
  id?: string;
  roseImg?: string;
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
    pushToken?: string;
    avatarImg?: string;
}
