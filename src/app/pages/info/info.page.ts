import { Component } from '@angular/core';
import {
  IonContent,
  IonIcon,
  IonItem,
  IonList,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
  imports: [IonContent, IonIcon, IonItem, IonList],
})
export class InfoPage {}
