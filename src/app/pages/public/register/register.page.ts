import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService } from "../../../services/auth.service";
import { AlertController, IonicModule, LoadingController } from "@ionic/angular";
import { Router, RouterLink, RouterLinkActive, ActivatedRoute } from "@angular/router";
import { NgIf } from "@angular/common";
import { UserProfileService } from "../../../services/user-profile.service";
import { UserProfile } from "../../../model/interfaces";
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  imports: [
    IonicModule,
    ReactiveFormsModule,
    RouterLink,
    RouterLinkActive,
    NgIf,
    FormsModule
  ],
  standalone: true
})
export class RegisterPage implements OnInit {
  credentials: FormGroup;
  currentSegment: string = 'register';

  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private authService: AuthService,
    private router: Router,
    private userService: UserProfileService,
    private route: ActivatedRoute
  ) {
    this.credentials = this.fb.group({
      displayName: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      birthDate: ['', [Validators.required]],
      city: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    this.route.url.subscribe(() => {
      if (this.router.url === '/login') {
        this.currentSegment = 'login';
      } else if (this.router.url === '/register') {
        this.currentSegment = 'register';
      }
    });
  }

  async register() {
    const loading = await this.loadingController.create();
    await loading.present();

    const user = await this.authService.register(this.credentials.value);
    await loading.dismiss();

    if (user) {
      this.authService.getUserId().pipe(take(1)).subscribe({
        next: userId => {
          const userProfile: UserProfile = {
            id: userId,
            displayName: this.credentials.get('displayName').value,
            email: this.credentials.get('email').value,
            birthDate: this.credentials.get('birthDate').value,
            city: this.credentials.get('city').value
          };

          this.userService.setUserProfile(userProfile);
          this.router.navigateByUrl('/tabs', { replaceUrl: true });
        },
        error: err => {
          this.showAlert('Registration failed', 'Could not get user ID. Please try again.');
        }
      });
    } else {
      this.showAlert('Registration failed', 'Please try again!');
    }
  }

  get displayName() {
    return this.credentials.get('displayName');
  }

  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  get birthDate() {
    return this.credentials.get('birthDate');
  }

  get city() {
    return this.credentials.get('city');
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
