import {Component, Input} from '@angular/core';
import {SideMenuComponent} from "../side-menu/side-menu.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [
    SideMenuComponent
  ],
  standalone: true
})
export class HeaderComponent {

  @Input() title?: string;

  constructor() { }

}
