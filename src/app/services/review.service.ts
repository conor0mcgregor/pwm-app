import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, Firestore, orderBy, query } from '@angular/fire/firestore';
import { BehaviorSubject, catchError, from, map, Observable, of, switchMap } from 'rxjs';

import { SEED_REVIEWS } from '../data/seed-data';
import { Resena } from '../models/resena.model';

const REVIEWS_KEY = 'pwm_refugio_reviews';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly firestore = inject(Firestore, { optional: true });
  private readonly localReviewsSubject = new BehaviorSubject<Resena[]>(this.loadLocalReviews());

  getReviews(): Observable<Resena[]> {
    if (!this.firestore) {
      return this.localReviewsSubject.asObservable();
    }

    return collectionData(collection(this.firestore, 'resenas'), { idField: 'id' }).pipe(
      map((reviews) => {
        if (!reviews.length) {
          return this.localReviewsSubject.value;
        }
        const mappedReviews = reviews.map((r: any) => ({
          id: r.id,
          usuario: r.usuario || r.Usuario || 'Usuario Anónimo',
          comentario: r.comentario || r.Comentario || 'Sin comentario',
          valoracion: r.valoracion ?? r.Valoracion ?? 5,
          fecha: r.fecha || r.Fecha || new Date().toISOString()
        } as Resena));

        // Ordenar localmente por fecha descendente
        return mappedReviews.sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime());
      }),
      catchError(() => this.localReviewsSubject.asObservable()),
    );
  }

  addReview(review: Omit<Resena, 'id' | 'fecha'>): Observable<Resena> {
    const newReview: Resena = {
      ...review,
      id: `resena_${Date.now()}`,
      fecha: new Date().toISOString(),
    };

    if (!this.firestore) {
      this.addLocalReview(newReview);
      return of(newReview);
    }

    return from(addDoc(collection(this.firestore, 'resenas'), newReview)).pipe(
      switchMap((documentReference) => {
        const savedReview = { ...newReview, id: documentReference.id };
        this.addLocalReview(savedReview);
        return of(savedReview);
      }),
      catchError(() => {
        this.addLocalReview(newReview);
        return of(newReview);
      }),
    );
  }

  private addLocalReview(review: Resena): void {
    const reviews = [review, ...this.localReviewsSubject.value];
    localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
    this.localReviewsSubject.next(reviews);
  }

  private loadLocalReviews(): Resena[] {
    const rawReviews = localStorage.getItem(REVIEWS_KEY);
    if (!rawReviews) {
      return SEED_REVIEWS;
    }

    try {
      const parsedReviews = JSON.parse(rawReviews) as Resena[];
      return parsedReviews.length ? parsedReviews : SEED_REVIEWS;
    } catch {
      return SEED_REVIEWS;
    }
  }
}
