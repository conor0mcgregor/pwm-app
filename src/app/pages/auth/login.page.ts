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
  IonText,
} from '@ionic/angular/standalone';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./auth.page.scss'],
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
    IonText,
  ],
})
export class LoginPage {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  isSubmitting = false;
  errorMessage = '';

  submit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const { email, password } = this.loginForm.getRawValue();
    this.authService.login(email, password).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.router.navigateByUrl(this.route.snapshot.queryParamMap.get('returnUrl') ?? '/tabs/perfil');
      },
      error: () => {
        this.isSubmitting = false;
        this.errorMessage = 'Email o contraseña incorrectos.';
      }
    });
  }
}
