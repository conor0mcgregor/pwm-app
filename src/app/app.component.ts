import { Component } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  addCircleOutline,
  calendarOutline,
  callOutline,
  cashOutline,
  chatbubbleEllipsesOutline,
  checkmarkCircleOutline,
  closeCircleOutline,
  createOutline,
  funnelOutline,
  heartOutline,
  homeOutline,
  informationCircleOutline,
  locationOutline,
  logInOutline,
  logOutOutline,
  mailOutline,
  maleFemaleOutline,
  mapOutline,
  pawOutline,
  personCircleOutline,
  searchOutline,
  star,
  starOutline,
  timeOutline,
  trashOutline,
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet],
})
export class AppComponent {
  constructor() {
    addIcons({
      addCircleOutline,
      calendarOutline,
      callOutline,
      cashOutline,
      chatbubbleEllipsesOutline,
      checkmarkCircleOutline,
      closeCircleOutline,
      createOutline,
      funnelOutline,
      heartOutline,
      homeOutline,
      informationCircleOutline,
      locationOutline,
      logInOutline,
      logOutOutline,
      mailOutline,
      maleFemaleOutline,
      mapOutline,
      pawOutline,
      personCircleOutline,
      searchOutline,
      star,
      starOutline,
      timeOutline,
      trashOutline,
    });
  }
}
