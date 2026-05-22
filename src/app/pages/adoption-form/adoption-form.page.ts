import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  IonBackButton,
  IonButton,
  IonContent,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonText,
} from '@ionic/angular/standalone';
import { Observable, switchMap } from 'rxjs';

import { Animal } from '../../models/animal.model';
import { AdoptionService } from '../../services/adoption.service';
import { AnimalService } from '../../services/animal.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-adoption-form',
  templateUrl: './adoption-form.page.html',
  styleUrls: ['./adoption-form.page.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,
    IonBackButton,
    IonButton,
    IonContent,
    IonIcon,
    IonInput,
    IonItem,
    IonLabel,
    IonList,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonText,
  ],
})
export class AdoptionFormPage {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly animalService = inject(AnimalService);
  private readonly adoptionService = inject(AdoptionService);
  private readonly authService = inject(AuthService);

  readonly animal$: Observable<Animal | undefined> = this.route.paramMap.pipe(
    switchMap((params) => this.animalService.getAnimalById(params.get('id') ?? '')),
  );

  readonly adoptionForm = this.fb.nonNullable.group({
    motivo: ['', [Validators.required, Validators.minLength(20)]],
    vivienda: ['piso'],
    experiencia: [''],
  });

  isSubmitting = false;

  submit(): void {
    if (this.adoptionForm.invalid) {
      this.adoptionForm.markAllAsTouched();
      return;
    }

    const currentUser = this.authService.currentUser;
    if (!currentUser) {
      this.router.navigate(['/login'], { queryParams: { returnUrl: this.router.url } });
      return;
    }

    const animalId = this.route.snapshot.paramMap.get('id') ?? '';
    const formValue = this.adoptionForm.getRawValue();
    const motivo = `${formValue.motivo}\n\nVivienda: ${formValue.vivienda}\nExperiencia: ${formValue.experiencia || 'No indicada'}`;

    this.isSubmitting = true;
    this.adoptionService
      .requestAdoption({
        usuarioId: currentUser.uid,
        animalId,
        motivo,
      })
      .subscribe(() => {
        this.isSubmitting = false;
        this.router.navigate(['/tabs/perfil']);
      });
  }
}
