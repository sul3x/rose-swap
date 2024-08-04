import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonCard, IonCardContent,
  IonCardHeader, IonCardTitle, IonCol,
  IonContent,
  IonFab, IonFabButton,
  IonHeader, IonIcon, IonItem, IonLabel,
  IonList, IonRow, IonThumbnail,
  IonTitle,
  IonToolbar,
  AlertController
} from '@ionic/angular/standalone';
import { ActivatedRoute, Router } from "@angular/router";
import { IRose } from "../../../model/interfaces";
import { MyRoseGardenService } from "../../../services/my-rose-garden.service";
import { addIcons } from "ionicons";
import { arrowBackOutline, mailOutline } from "ionicons/icons";
import { UserProfileService } from "../../../services/user-profile.service";
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-other-gardens',
  templateUrl: './other-gardens.page.html',
  styleUrls: ['./other-gardens.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonFab, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonRow, IonItem, IonThumbnail, IonCol, IonLabel, IonFabButton, IonIcon]
})
export class OtherGardensPage implements OnInit, OnDestroy {

  uid: string;
  userGarden: IRose[] = [];
  ownerNameGarden: string;
  private gardenSubscription: Subscription;

  constructor(private route: ActivatedRoute,
              private gardenService: MyRoseGardenService,
              private router: Router,
              private alertController: AlertController,
              private userProfileService: UserProfileService) {
  }

  ngOnInit() {

    addIcons({
      arrowBackOutline,
      mailOutline
    });

    this.route.paramMap.subscribe(params => {
      this.uid = params.get('uid');
      console.log('Received UID:', this.uid);
    });
  }

  ionViewWillEnter() {
    // Fetch the garden
    this.gardenSubscription = this.gardenService.getUeserGardenFirestore(this.uid).subscribe(async (myGarden: IRose[]) => {
      if (myGarden.length == 0) {
        const alert = await this.alertController.create({
          header: 'Sorry, this garden is empty :3',
          buttons: [{
            text: 'Back to Gardens',
            handler: async () => {
              await this.router.navigate(['/tabs/tab2']);
            }
          }]
        });
        await alert.present();
      } else {
        this.userGarden = myGarden;
      }
    });

    this.userProfileService.getUserDisplayName(this.uid).then(owner => {
      this.ownerNameGarden = owner;
    });
  }

  ionViewWillLeave() {
    this.cleanupSubscriptions();
  }

  ngOnDestroy() {
    this.cleanupSubscriptions();
  }

  private cleanupSubscriptions() {
    if (this.gardenSubscription) {
      this.gardenSubscription.unsubscribe();
    }
  }

  goBackToMap() {
    this.router.navigate(['/tabs/tab2']);
  }
}
