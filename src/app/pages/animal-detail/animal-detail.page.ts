import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import {
  IonBackButton,
  IonBadge,
  IonButton,
  IonChip,
  IonContent,
  IonIcon,
  IonLabel,
} from '@ionic/angular/standalone';
import { Observable, switchMap } from 'rxjs';

import { Animal } from '../../models/animal.model';
import { AnimalService } from '../../services/animal.service';

@Component({
  selector: 'app-animal-detail',
  templateUrl: './animal-detail.page.html',
  styleUrls: ['./animal-detail.page.scss'],
  imports: [
    CommonModule,
    RouterLink,
    IonBackButton,
    IonBadge,
    IonButton,
    IonChip,
    IonContent,
    IonIcon,
    IonLabel,
  ],
})
export class AnimalDetailPage {
  private readonly route = inject(ActivatedRoute);
  private readonly animalService = inject(AnimalService);

  readonly animal$: Observable<Animal | undefined> = this.route.paramMap.pipe(
    switchMap((params) => this.animalService.getAnimalById(params.get('id') ?? '')),
  );
}
