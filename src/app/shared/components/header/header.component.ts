import {Component, Input} from '@angular/core';
import {SideMenuComponent} from "../side-menu/side-menu.component";


import {
  IonButton, IonButtons,
  IonContent,
  IonHeader,
  IonMenuButton,
  IonTitle,
  IonToolbar
} from "@ionic/angular/standalone";


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    SideMenuComponent,
    IonHeader,
    IonToolbar,
    IonContent,
    IonButton,
    IonTitle,
    IonButtons,
    IonMenuButton
  ],
  standalone: true
})
export class HeaderComponent {

  @Input() title?: string;

  constructor() { }

}
