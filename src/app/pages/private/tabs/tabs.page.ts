import {Component, EnvironmentInjector, inject, OnInit} from '@angular/core';
import {IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonContent} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {ellipse, heartCircleOutline, square} from 'ionicons/icons';
import {HeaderComponent} from "../../../shared/components/header/header.component";

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, HeaderComponent, IonContent],
})
export class TabsPage implements OnInit {
  public environmentInjector = inject(EnvironmentInjector);
  isDarkMode: boolean = false;

  constructor() {
    addIcons(
      {
        'my-garden' : '../../assets/icon/my-garden.svg',
        'other-gardens': '../../assets/icon/other-gardens.svg',
        'my-garden-dark' : '../../assets/icon/my-garden-dark.svg',
        'other-gardens-dark': '../../assets/icon/other-gardens-dark.svg',
        heartCircleOutline
      });
  }

  ngOnInit() {
    this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      this.isDarkMode = event.matches;
    });
  }
}
