import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  LoadingController,
  ToastController,
  AlertController,
  IonContent,
  IonItem,
  IonAvatar, IonInput, IonNote, IonTextarea, IonButton
} from '@ionic/angular/standalone';
import { UserProfileService } from '../../../services/user-profile.service';
import { UserProfile } from '../../../model/interfaces';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import { Router } from "@angular/router";
import { PhotoAvatarService } from "../../../services/photo-avatar.service";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, IonContent, IonItem, IonAvatar, IonInput, IonNote, IonTextarea, IonButton],
})
export class Tab3Page implements OnInit {
  profileForm: FormGroup;
  userId: string;
  userEmail: string;
  profileData = null;

  constructor(
    private fb: FormBuilder,
    private userProfileService: UserProfileService,
    private authService: AuthService,
    private toastController: ToastController,
    private router: Router,
    private photoAvatarService: PhotoAvatarService,
    private loadingController: LoadingController,
    private alertController: AlertController
  ) {

    this.profileForm = this.fb.group({
      displayName: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      city: ['', [Validators.required]],
      aboutMe: [''] // Optional field, initially empty
    });

    this.photoAvatarService.getUserProfileData().subscribe(data => {
      this.profileData = data;
    });
  }

  async ngOnInit() {
    try {
      this.userId = this.authService.getUserId();
      if (this.userId) {
        const userProfile = await this.userProfileService.getUserProfile(this.userId);
        if (userProfile) {
          this.userEmail = userProfile.email;
          this.profileForm.patchValue({
            displayName: userProfile.displayName,
            birthDate: userProfile.birthDate,
            city: userProfile.city,
            aboutMe: userProfile.aboutMe || ''
          });
        }
      } else {
        console.error('User ID not available');
      }
    } catch (error) {
      console.error('Error fetching user profile', error);
    }
  }

  async saveProfile() {
    if (this.profileForm.valid && this.userId) {
      const updatedProfile: UserProfile = {
        id: this.userId,
        displayName: this.profileForm.get('displayName').value,
        email: this.userEmail,
        birthDate: this.profileForm.get('birthDate').value,
        city: this.profileForm.get('city').value,
        aboutMe: this.profileForm.get('aboutMe').value || '',
        avatarImg: this.photoAvatarService.getAvatarImgURL() || this.profileData.avatarImg
      };

      console.log("profileIMg: "+updatedProfile.avatarImg);

      try {
        await this.userProfileService.setUserProfile(updatedProfile);
        await this.showToast('Profile saved successfully');


      } catch (error) {
        console.error('Failed to save user profile', error);
        await this.showToast('Failed to save profile');
      }
    } else {
      console.error('Form is invalid or user ID is not available');
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
      cssClass: 'large-toast'
    });
    await toast.present();
  }


  get displayName() {
    return this.profileForm.get('displayName');
  }

  get birthDate() {
    return this.profileForm.get('birthDate');
  }

  get city() {
    return this.profileForm.get('city');
  }

  get aboutMe() {
    return this.profileForm.get('aboutMe');
  }

  async changeImage() {
    const image = await Camera.getPhoto({
      quality: 90,
      allowEditing: false,
      resultType: CameraResultType.Base64,
      source: CameraSource.Prompt,
    });
    console.log('new image: ', image);

    if (image) {
      const loading = await this.loadingController.create();
      await loading.present();

      const result = await this.photoAvatarService.uploadImage(image);
      await loading.dismiss();

      if (!result) {
        const alert = await this.alertController.create({
          header: 'Upload failed',
          message: 'There was a problem uploading your avatar.',
          buttons: ['OK'],
        });
        await alert.present();
      }
    }
  }
}
