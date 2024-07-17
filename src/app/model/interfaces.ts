import {Photo} from "@capacitor/camera";

export interface IRose {
  id?: number;
  photo: Photo;
  name: string;
  intensityFragrance: number;
  moreInfo: string;
}
