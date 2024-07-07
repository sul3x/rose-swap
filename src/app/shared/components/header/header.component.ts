import { Component, OnInit } from '@angular/core';
import {IonicModule} from "@ionic/angular";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {SideMenuComponent} from "../side-menu/side-menu.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    IonicModule,
    SideMenuComponent
  ],
  standalone: true
})
export class HeaderComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('header works')
  }


}
