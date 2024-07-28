import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ToastController } from '@ionic/angular';
import { UserProfileService } from '../../../services/user-profile.service';
import { UserProfile } from '../../../model/interfaces';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../services/auth.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [ReactiveFormsModule, IonicModule, CommonModule],
})
export class Tab3Page implements OnInit {
  profileForm: FormGroup;
  userId: string;
  userEmail: string; // To store the email separately

  constructor(
    private fb: FormBuilder,
    private userProfileService: UserProfileService,
    private authService: AuthService, // Assuming you have an AuthService to get the user ID
    private toastController: ToastController,
    private router: Router // Inject ToastController
  ) {
    this.profileForm = this.fb.group({
      displayName: ['', [Validators.required]],
      birthDate: ['', [Validators.required]],
      city: ['', [Validators.required]],
      aboutMe: [''] // Optional field, initially empty
    });
  }

  async ngOnInit() {
    try {
      this.userId = this.authService.getUserId();
      if (this.userId) {
        const userProfile = await this.userProfileService.getUserProfile(this.userId);
        if (userProfile) {
          this.userEmail = userProfile.email; // Store the email separately
          this.profileForm.patchValue({
            displayName: userProfile.displayName,
            birthDate: userProfile.birthDate,
            city: userProfile.city,
            aboutMe: userProfile.aboutMe
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
        email: this.userEmail, // Use the stored email value
        birthDate: this.profileForm.get('birthDate').value,
        city: this.profileForm.get('city').value,
        aboutMe: this.profileForm.get('aboutMe').value
      };

      try {
        await this.userProfileService.setUserProfile(updatedProfile);
        await this.showToast('Profile saved successfully');
        await this.router.navigateByUrl('/tabs'); // Navigate to my-garden

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

  // Getters for form controls
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
}
