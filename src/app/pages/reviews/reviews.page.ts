import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonTitle,
  IonToolbar,
} from '@ionic/angular/standalone';

import { Resena } from '../../models/resena.model';
import { ReviewService } from '../../services/review.service';

@Component({
  selector: 'app-reviews',
  templateUrl: './reviews.page.html',
  styleUrls: ['./reviews.page.scss'],
  imports: [
    CommonModule,
    IonButton,
    IonButtons,
    IonContent,
    IonHeader,
    IonIcon,
    IonModal,
    IonTitle,
    IonToolbar,
  ],
})
export class ReviewsPage implements OnInit {
  private readonly reviewService = inject(ReviewService);
  private readonly destroyRef = inject(DestroyRef);

  reviews: Resena[] = [];
  starIndexes = [1, 2, 3, 4, 5];
  selectedReview: Resena | null = null;
  isModalOpen = false;

  ngOnInit(): void {
    this.reviewService
      .getReviews()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((reviews) => {
        this.reviews = reviews;
      });
  }

  openReview(review: Resena): void {
    this.selectedReview = review;
    this.isModalOpen = true;
  }

  closeReview(): void {
    this.isModalOpen = false;
    this.selectedReview = null;
  }
}
