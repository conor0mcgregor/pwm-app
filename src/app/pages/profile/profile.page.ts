import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  IonButton,
  IonContent,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonText,
  IonThumbnail,
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
    IonContent,
    IonHeader,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonNote,
    IonText,
    IonThumbnail,
    IonTitle,
    IonToolbar,
  ],
})
export class ProfilePage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly adoptionService = inject(AdoptionService);
  private readonly animalService = inject(AnimalService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  currentUser: Usuario | null = null;
  adoptedAnimals: AdoptedAnimal[] = [];
  isSaving = false;

  readonly profileForm = this.fb.nonNullable.group({
    nombre: ['', Validators.required],
    apellidos: ['', Validators.required],
    dni: ['', Validators.required],
    direccion: ['', Validators.required],
    telefono: ['', Validators.required],
  });

  ngOnInit(): void {
    this.authService.currentUser$
      .pipe(
        switchMap((user) => {
          this.currentUser = user;
          if (!user) {
            this.adoptedAnimals = [];
            return of([[], []] as [Adopcion[], Animal[]]);
          }

          this.profileForm.patchValue({
            nombre: user.nombre,
            apellidos: user.apellidos,
            dni: user.dni,
            direccion: user.direccion,
            telefono: user.telefono,
          });

          return combineLatest([this.adoptionService.getUserAdoptions(user.uid), this.animalService.getAnimals()]);
        }),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe(([adoptions, animals]) => {
        this.adoptedAnimals = adoptions.map((adoption) => ({
          ...adoption,
          animal: animals.find((animal) => animal.id === adoption.animalId),
        }));
      });
  }

  saveProfile(): void {
    if (!this.currentUser || this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.authService.updateUser(this.profileForm.getRawValue()).subscribe(() => {
      this.isSaving = false;
    });
  }

  cancelAdoption(id: string): void {
    this.adoptionService.cancelAdoption(id).subscribe();
  }

  logout(): void {
    this.authService.logout().subscribe(() => this.router.navigate(['/login']));
  }
}
