import { Component, EnvironmentInjector, inject } from '@angular/core';
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
export class TabsPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor() {
    addIcons(
      {
        "my-garden" : "../../assets/icon/my-garden.svg",
        'other-gardens': '../../assets/icon/other-gardens.svg',
        heartCircleOutline
      });
  }
}
