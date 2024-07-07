import { Component } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  standalone: true,
  imports: [
    IonicModule
  ]
})
export class SideMenuComponent   {

  constructor(
      private router: Router,
      private authService: AuthService) { }



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
