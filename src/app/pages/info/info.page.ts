import { Component } from '@angular/core';
import {
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonList,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-info',
  templateUrl: './info.page.html',
  styleUrls: ['./info.page.scss'],
  imports: [IonContent, IonHeader, IonIcon, IonItem, IonList, IonTitle, IonToolbar],
})
export class InfoPage {}
