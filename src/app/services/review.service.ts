import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, Firestore } from '@angular/fire/firestore';
import { BehaviorSubject, catchError, from, map, Observable, of, switchMap } from 'rxjs';

import { SEED_REVIEWS } from '../data/seed-data';
import { Resena } from '../models/resena.model';
import { deleteDoc, doc, query, where } from '@angular/fire/firestore';
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
          idUsuario: r.idUsuario ?? r.IdUsuario ?? '',
          animalId: r.animalId ?? r.AnimalId ?? '',
          titulo: r.titulo || r.Titulo || '',
          comentario: r.comentario || r.Comentario || r.resena || r.Resena || 'Sin comentario',
          resena: r.resena || r.Resena || r.comentario || r.Comentario || 'Sin comentario',
          nombreAnimal: r.nombreAnimal || r.NombreAnimal || '',
          foto: r.foto || r.Foto || '',
          valoracion: r.valoracion ?? r.Valoracion ?? 5,
          fecha: r.fecha || r.Fecha || new Date().toISOString(),
        } as Resena));

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
  deleteReviewByAnimalId(animalId: string, userId: string): Observable<void> {
    if (!this.firestore) {
      const reviews = this.localReviewsSubject.value.filter(
        r => !(r.animalId === animalId && r.idUsuario === userId)
      );
      localStorage.setItem(REVIEWS_KEY, JSON.stringify(reviews));
      this.localReviewsSubject.next(reviews);
      return of(undefined);
    }

    const q = query(
      collection(this.firestore, 'resenas'),
      where('animalId', '==', animalId),
      where('idUsuario', '==', userId)
    );

    return collectionData(q, { idField: 'id' }).pipe(
      switchMap((docs: any[]) => {
        if (!docs.length) return of(undefined);
        return from(deleteDoc(doc(this.firestore!, 'resenas', docs[0].id)));
      }),
      catchError(() => of(undefined))
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
