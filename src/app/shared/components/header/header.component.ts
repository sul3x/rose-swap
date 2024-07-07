import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    IonicModule
  ],
  standalone: true
})
export class HeaderComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
    console.log('header works')
  }

  async logout() {
    try {
      await this.authService.logout();
      console.log('Logged out successfully');
      this.router.navigate(['/login']); // Redirect to login or any other page
    } catch (error) {
      console.error('Logout error', error);
    }
  }
}
