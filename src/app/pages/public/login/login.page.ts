import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from "@angular/common";
import { AuthService } from "../../../services/auth.service";
import {
  AlertController, IonButton,
  IonContent,
  IonHeader,
  IonImg, IonInput, IonItem, IonLabel, IonNote,
  IonSegment, IonSegmentButton,
  IonToolbar,
  LoadingController
} from "@ionic/angular/standalone";
import { Router, RouterLink, RouterLinkActive, ActivatedRoute } from "@angular/router";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  imports: [
    RouterLink,
    RouterLinkActive,
    ReactiveFormsModule,
    FormsModule,
    NgIf,
    CommonModule,
    IonHeader,
    IonToolbar,
    IonImg,
    IonContent,
    IonSegment,
    IonSegmentButton,
    IonLabel,
    IonItem,
    IonInput,
    IonNote,
    IonButton
  ],
  standalone: true
})
export class LoginPage implements OnInit {
  credentials: FormGroup;
  currentSegment: string = 'login';

  constructor(private fb: FormBuilder,
              private loadingController: LoadingController,
              private alertController: AlertController,
              private authService: AuthService,
              private router: Router,
              private route: ActivatedRoute
  ) {
    this.credentials = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
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

  async login() {
    const loading = await this.loadingController.create();
    await loading.present();

    const user = await this.authService.login(this.credentials.value);
    await loading.dismiss();

    if (user) {
      this.router.navigateByUrl('/tabs', { replaceUrl: true });
    } else {
      this.showAlert('Login failed', 'Please try again!');
    }
  }

  async showAlert(header, message) {
    const alert = await this.alertController.create({
      header,
      message,
      buttons: ['OK']
    });
    await alert.present();
  }

  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }
}
