import { inject, Injectable } from '@angular/core';
import { addDoc, collection, collectionData, deleteDoc, doc, Firestore, query, where } from '@angular/fire/firestore';
import { BehaviorSubject, catchError, from, map, Observable, of, switchMap } from 'rxjs';

import { Adopcion } from '../models/adopcion.model';

const ADOPTIONS_KEY = 'pwm_refugio_adoptions';

@Injectable({ providedIn: 'root' })
export class AdoptionService {
  private readonly firestore = inject(Firestore, { optional: true });
  private readonly localAdoptionsSubject = new BehaviorSubject<Adopcion[]>(this.loadLocalAdoptions());

  getUserAdoptions(usuarioId: string): Observable<Adopcion[]> {
    if (!this.firestore) {
      return this.localAdoptionsSubject.pipe(
        map((adoptions) => adoptions.filter((adoption) => adoption.usuarioId === usuarioId)),
      );
    }

    const adoptionsQuery = query(collection(this.firestore, 'adopciones'), where('usuarioId', '==', usuarioId));
    return collectionData(adoptionsQuery, { idField: 'id' }).pipe(
      map((adoptions) => adoptions as Adopcion[]),
      catchError(() =>
        this.localAdoptionsSubject.pipe(
          map((adoptions) => adoptions.filter((adoption) => adoption.usuarioId === usuarioId)),
        ),
      ),
    );
  }

  requestAdoption(adoption: Omit<Adopcion, 'id' | 'fecha'>): Observable<Adopcion> {
    const newAdoption: Adopcion = {
      ...adoption,
      id: `adopcion_${Date.now()}`,
      fecha: new Date().toISOString(),
    };

    if (!this.firestore) {
      this.addLocalAdoption(newAdoption);
      return of(newAdoption);
    }

    return from(addDoc(collection(this.firestore, 'adopciones'), newAdoption)).pipe(
      switchMap((documentReference) => {
        const savedAdoption = { ...newAdoption, id: documentReference.id };
        this.addLocalAdoption(savedAdoption);
        return of(savedAdoption);
      }),
      catchError(() => {
        this.addLocalAdoption(newAdoption);
        return of(newAdoption);
      }),
    );
  }

  cancelAdoption(id: string): Observable<void> {
    if (!this.firestore) {
      this.removeLocalAdoption(id);
      return of(undefined);
    }

    return from(deleteDoc(doc(this.firestore, 'adopciones', id))).pipe(
      switchMap(() => {
        this.removeLocalAdoption(id);
        return of(undefined);
      }),
      catchError(() => {
        this.removeLocalAdoption(id);
        return of(undefined);
      }),
    );
  }

  private addLocalAdoption(adoption: Adopcion): void {
    const adoptions = [...this.localAdoptionsSubject.value, adoption];
    this.saveLocalAdoptions(adoptions);
  }

  private removeLocalAdoption(id: string): void {
    const adoptions = this.localAdoptionsSubject.value.filter((adoption) => adoption.id !== id);
    this.saveLocalAdoptions(adoptions);
  }

  private saveLocalAdoptions(adoptions: Adopcion[]): void {
    localStorage.setItem(ADOPTIONS_KEY, JSON.stringify(adoptions));
    this.localAdoptionsSubject.next(adoptions);
  }

  private loadLocalAdoptions(): Adopcion[] {
    const rawAdoptions = localStorage.getItem(ADOPTIONS_KEY);
    if (!rawAdoptions) {
      return [];
    }

    try {
      return JSON.parse(rawAdoptions) as Adopcion[];
    } catch {
      return [];
    }
  }
}
