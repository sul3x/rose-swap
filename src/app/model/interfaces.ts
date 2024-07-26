import {Photo} from "@capacitor/camera";

export interface IRose {
  id?: string;
  //photo: Photo;
  name: string;
  cuttings: number;
  intensityFragrance: number;
  moreInfo: string;
}
