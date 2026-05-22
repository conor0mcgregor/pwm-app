import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonModal,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

import { Resena } from '../../models/resena.model';
import { AuthService } from '../../services/auth.service';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.page.html',
  styleUrls: ['./reviews.page.scss'],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonItem,
    IonLabel,
    IonList,
    IonModal,
    IonNote,
    IonSelect,
    IonSelectOption,
    IonTextarea,
    IonTitle,
    IonToolbar,
  ],
})
export class ReviewsPage implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly reviewService = inject(ReviewService);
  private readonly authService = inject(AuthService);
  private readonly destroyRef = inject(DestroyRef);

  reviews: Resena[] = [];
  starIndexes = [1, 2, 3, 4, 5];
  selectedReview: Resena | null = null;
  isModalOpen = false;

  readonly reviewForm = this.fb.nonNullable.group({
    valoracion: [5, [Validators.required, Validators.min(1), Validators.max(5)]],
    comentario: ['', [Validators.required, Validators.minLength(10)]],
  });

  ngOnInit(): void {
    this.reviewService
      .getReviews()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((reviews) => {
        this.reviews = reviews;
      });
  }

  openReview(review: Resena) {
    this.selectedReview = review;
    this.isModalOpen = true;
  }

  closeReview() {
    this.isModalOpen = false;
    this.selectedReview = null;
  }

  submit(): void {
    if (this.reviewForm.invalid) {
      this.reviewForm.markAllAsTouched();
      return;
    }

    const currentUser = this.authService.currentUser;
    const formValue = this.reviewForm.getRawValue();
    this.reviewService
      .addReview({
        usuario: currentUser ? `${currentUser.nombre} ${currentUser.apellidos}`.trim() : 'Visitante',
        comentario: formValue.comentario,
        valoracion: formValue.valoracion,
      })
      .subscribe(() => this.reviewForm.reset({ valoracion: 5, comentario: '' }));
  }
}
