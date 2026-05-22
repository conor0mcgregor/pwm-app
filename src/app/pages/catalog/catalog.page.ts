import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  IonBadge,
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonRow,
  IonSearchbar,
  IonSegment,
  IonSegmentButton,
  IonSelect,
  IonSelectOption,
  IonSkeletonText,
  IonText,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

import { Animal, AnimalFilters } from '../../models/animal.model';
import { AnimalService } from '../../services/animal.service';

@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.page.html',
  styleUrls: ['./catalog.page.scss'],
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    IonBadge,
    IonButton,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardSubtitle,
    IonCardTitle,
    IonCol,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonRow,
    IonSearchbar,
    IonSegment,
    IonSegmentButton,
    IonSelect,
    IonSelectOption,
    IonSkeletonText,
    IonText,
    IonTitle,
    IonToolbar,
  ],
})
export class CatalogPage implements OnInit {
  private readonly animalService = inject(AnimalService);
  private readonly destroyRef = inject(DestroyRef);

  animals: Animal[] = [];
  filteredAnimals: Animal[] = [];
  especies = ['todos', 'Perro', 'Gato', 'Conejo'];
  isLoading = true;

  filters: AnimalFilters = {
    search: '',
    especie: 'todos',
    edad: 'todas',
  };

  ngOnInit(): void {
    this.animalService
      .getAnimals()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((animals) => {
        this.animals = animals;
        this.applyFilters();
        this.isLoading = false;
      });
  }

  applyFilters(): void {
    this.filteredAnimals = this.animalService.filterAnimals(this.animals, this.filters);
  }

  trackByAnimalId(_: number, animal: Animal): string {
    return animal.id;
  }
}
