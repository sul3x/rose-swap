import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {
  IonCard, IonCardContent,
  IonCardHeader, IonCardTitle, IonCol,
  IonContent,
  IonFab, IonFabButton,
  IonHeader, IonIcon, IonItem, IonLabel,
  IonList, IonRow, IonThumbnail,
  IonTitle,
  IonToolbar
} from '@ionic/angular/standalone';
import {ActivatedRoute, Router} from "@angular/router";
import {IRose} from "../../../model/interfaces";
import {MyRoseGardenService} from "../../../services/my-rose-garden.service";
import {addIcons} from "ionicons";
import {arrowBackOutline, mailOutline} from "ionicons/icons";
import {AlertController} from "@ionic/angular";

@Component({
  selector: 'app-other-gardens',
  templateUrl: './other-gardens.page.html',
  styleUrls: ['./other-gardens.page.scss'],
  standalone: true,
  imports: [IonContent, IonHeader, IonTitle, IonToolbar, CommonModule, FormsModule, IonFab, IonList, IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonRow, IonItem, IonThumbnail, IonCol, IonLabel, IonFabButton, IonIcon]
})
export class OtherGardensPage implements OnInit {

  uid: string;
  userGarden: IRose[] = [];

  constructor(private route: ActivatedRoute,
              private gardenService: MyRoseGardenService,
              private router: Router,
              private alertController: AlertController) {
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
    this.gardenService.getUeserGardenFirestore(this.uid).subscribe(async (myGarden: IRose[]) => {
      if (myGarden.length == 0) {
        const alert = await this.alertController.create({
          header: 'Sorry, this garden is empty :3',

          buttons: [{
            text: 'Back to Gardens',
            handler: () => {
              this.router.navigate(['/tabs/tab2']);

            }
          }]
        })
        await alert.present();

      } else {
        this.userGarden = myGarden;
      }

    });
  }

  goBackToMap() {
    this.router.navigate(['/tabs/tab2']);

  }
}
