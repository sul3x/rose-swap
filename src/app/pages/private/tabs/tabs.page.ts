import {Component, OnInit} from '@angular/core';
import {IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonContent} from '@ionic/angular/standalone';
import {addIcons} from 'ionicons';
import {heartCircleOutline} from 'ionicons/icons';
import {HeaderComponent} from "../../../shared/components/header/header.component";
import {ActivatedRoute, NavigationEnd, Router} from "@angular/router";
import {filter} from "rxjs";

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss'],
  standalone: true,
  imports: [IonTabs, IonTabBar, IonTabButton, IonIcon, IonLabel, IonContent, HeaderComponent],
})
export class TabsPage implements OnInit {
  isDarkMode: boolean = false;
  public title: string;
  selectedTab: string = '';
  currentRouteUrl: string;

  constructor(private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      let currentRoute = this.route.root;
      while (currentRoute.children && currentRoute.children.length > 0) {
        currentRoute = currentRoute.children[0];
      }
      this.title = currentRoute.snapshot.data['title'];

      console.log('current route: ', currentRoute);

      this.currentRouteUrl = this.router.url;
      console.log('ruta actual: ', this.currentRouteUrl);

      this.updateSelectedTab();
    });

    addIcons(
      {
        'my-garden' : '../../assets/icon/my-garden.svg',
        'other-gardens': '../../assets/icon/other-gardens.svg',
        'my-garden-dark' : '../../assets/icon/my-garden-dark.svg',
        'other-gardens-dark': '../../assets/icon/other-gardens-dark.svg',
        'my-garden-green': '../../assets/icon/my-garden-green.svg',
        'other-gardens-green': '../../assets/icon/other-gardens-green.svg',
        heartCircleOutline
      });

    this.isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
      this.isDarkMode = event.matches;
    });
  }

  updateSelectedTab() {
    if (this.currentRouteUrl.includes('/tabs/tab1')) {
      this.selectedTab = 'my-garden';
    } else if (this.currentRouteUrl.includes('/tabs/tab2')) {
      this.selectedTab = 'other-gardens';
    } else if (this.currentRouteUrl.includes('/tabs/tab3')) {
      this.selectedTab = 'about-me';
    }
  }

  returnIconMyGarden(): string {
    if (this.selectedTab === 'my-garden') {
      return 'my-garden';
    } else {
      return this.isDarkMode ? 'my-garden-dark' : 'my-garden';
    }
  }

  returnIconOtherGardens(): string {
    if (this.selectedTab === 'other-gardens') {
      return 'other-gardens';
    } else {
      return this.isDarkMode? 'other-gardens-dark' : 'other-gardens';
    }
  }
}
