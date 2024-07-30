import {Component, OnInit} from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {AuthService} from "../../../services/auth.service";
import {Router, RouterLink} from "@angular/router";
import {addIcons} from "ionicons";
import {arrowForwardOutline} from "ionicons/icons";
import {MenuController} from "@ionic/angular/standalone";

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    RouterLink
  ]
})
export class SideMenuComponent implements OnInit {

  constructor(
    private router: Router,
    private authService: AuthService,
    private menu: MenuController) {
  }

  ngOnInit(): void {

    addIcons({
      arrowForwardOutline
    })

  }

  async logout() {
    try {
      await this.authService.logout();
      console.log('Logged out successfully');
      this.router.navigate(['/login']); // Redirect to login<app-header [title]="title"></app-header>
    } catch (error) {
      console.error('Logout error', error);
    }
  }

  closeMenu() {
    this.menu.close();
  }
}
