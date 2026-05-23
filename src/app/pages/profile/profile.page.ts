import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonSelect,
  IonSelectOption,
  IonText,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';
import { combineLatest, of, switchMap } from 'rxjs';

import { Adopcion } from '../../models/adopcion.model';
import { Animal } from '../../models/animal.model';
import { Usuario } from '../../models/usuario.model';
import { AdoptionService } from '../../services/adoption.service';
import { AnimalService } from '../../services/animal.service';
import { AuthService } from '../../services/auth.service';
import { ReviewService } from '../../services/review.service';

type AdoptedAnimal = Adopcion & { animal?: Animal };

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonModal,
    IonSelect,
    IonSelectOption,
    IonText,
    IonTextarea,
    IonTitle,
    IonToolbar,
  ],
})
export class ProfilePage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly adoptionService = inject(AdoptionService);
  private readonly animalService = inject(AnimalService);
  private readonly reviewService = inject(ReviewService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  currentUser: Usuario | null = null;
  adoptedAnimals: AdoptedAnimal[] = [];
  reviewedAnimalIds: string[] = [];
  isSaving = false;
  isReviewModalOpen = false;
  isSubmittingReview = false;
  selectedAdoption: AdoptedAnimal | null = null;
  starIndexes = [1, 2, 3, 4, 5];

  readonly profileForm = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    apellidos: ['', Validators.required],
    dni: [''],
    direccion: [''],
    telefono: [''],
  });

  readonly reviewForm = this.fb.nonNullable.group({
    valoracion: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    comentario: ['', [Validators.required, Validators.minLength(10)]],
  });

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(
        switchMap((user) => {
          this.currentUser = user;
          if (!user) {
            this.adoptedAnimals = [];
            this.reviewedAnimalIds = [];
            return of([[], [], []] as [Adopcion[], Animal[], any[]]);
          }
          this.profileForm.patchValue({
            nombre: user.nombre,
            apellidos: user.apellidos,
            dni: user.dni,
            direccion: user.direccion,
            telefono: user.telefono,
          });
          return combineLatest([
            this.adoptionService.getUserAdoptions(user.uid),
            this.animalService.getAnimals(),
            this.reviewService.getReviews(),
          ]);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(([adoptions, animals, reviews]) => {
        this.adoptedAnimals = adoptions.map((adoption) => ({
          ...adoption,
          animal: animals.find((animal) => animal.id === adoption.animalId),
        }));
        this.reviewedAnimalIds = reviews
          .filter(r => r.idUsuario === this.currentUser?.uid)
          .map(r => r.animalId ?? '');
      });
  }

  hasReviewed(animalId: string): boolean {
    return this.reviewedAnimalIds.includes(animalId);
  }

  saveProfile(): void {
    if (!this.currentUser || this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }
    this.isSaving = true;
    this.authService.updateUser(this.profileForm.getRawValue()).subscribe({
      next: () => { this.isSaving = false; },
      error: () => { this.isSaving = false; },
    });
  }

  openReviewModal(adoption: AdoptedAnimal): void {
    this.selectedAdoption = adoption;
    this.reviewForm.reset({ valoracion: 5, comentario: '' });
    this.isReviewModalOpen = true;
  }

  closeReviewModal(): void {
    this.isReviewModalOpen = false;
    this.selectedAdoption = null;
  }

  submitReview(): void {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }
    const formValue = this.reviewForm.getRawValue();
    this.isSubmittingReview = true;
    this.reviewService.addReview({
      usuario: `${this.currentUser?.nombre} ${this.currentUser?.apellidos}`.trim(),
      idUsuario: this.currentUser?.uid ?? '',
      animalId: this.selectedAdoption?.animalId ?? '',
      comentario: formValue.comentario,
      valoracion: formValue.valoracion,
      nombreAnimal: this.selectedAdoption?.animal?.nombre ?? '',
    }).subscribe({
      next: () => {
        this.isSubmittingReview = false;
        this.reviewedAnimalIds = [...this.reviewedAnimalIds, this.selectedAdoption?.animalId ?? ''];
        this.closeReviewModal();
      },
      error: () => {
        this.isSubmittingReview = false;
      },
    });
  }
  cancelAdoption(id: string): void {
    const adoption = this.adoptedAnimals.find(a => a.id === id);
    this.adoptionService.cancelAdoption(id).pipe(
      switchMap(() => adoption?.animalId
        ? this.animalService.updateAnimalStatus(adoption.animalId, 'disponible')
        : of(undefined)
      ),
      switchMap(() => adoption?.animalId && this.currentUser?.uid
        ? this.reviewService.deleteReviewByAnimalId(adoption.animalId, this.currentUser.uid)
        : of(undefined)
      )
    ).subscribe(() => {
      if (adoption?.animalId) {
        this.reviewedAnimalIds = this.reviewedAnimalIds.filter(rid => rid !== adoption.animalId);
      }
    });
  }

  logout(): void {
    this.authService.logout().subscribe(() => this.router.navigate(['/login']));
  }
}
