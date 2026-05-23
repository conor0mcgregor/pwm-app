import { inject, Injectable } from '@angular/core';
import { collection, collectionData, Firestore } from '@angular/fire/firestore';
import { catchError, map, Observable, of } from 'rxjs';

import { SEED_ANIMALS } from '../data/seed-data';
import { Animal, AnimalFilters } from '../models/animal.model';
import { doc, updateDoc } from '@angular/fire/firestore';
import { from } from 'rxjs';
@Injectable({ providedIn: 'root' })
export class AnimalService {
  private readonly firestore = inject(Firestore, { optional: true });

  getAnimals(): Observable<Animal[]> {
    if (!this.firestore) {
      return of(SEED_ANIMALS);
    }

    return collectionData(collection(this.firestore, 'animales'), { idField: 'id' }).pipe(
      map((animals) => {
        if (!animals.length) return SEED_ANIMALS;
        return animals.map((a: any) => {
          const id = a.id;
          return {
            id,
            nombre: a.nombre || a.Nombre || 'Sin nombre',
            especie: a.especie || a.Especie || 'Desconocida',
            raza: a.raza || a.Raza || 'Desconocida',
            sexo: a.sexo || a.Sexo || 'Desconocido',
            edad: a.edad ?? a.Edad ?? 0,
            peso: a.peso ?? a.Peso ?? 0,
            descripcion: a.descripcion || a.Descripcion || 'Sin descripcion',
            estado: a.estado || a.Estado || 'disponible',
            tasaAdopcion: a.tasaAdopcion ?? a.TasaAdopcion ?? 0,
            fotos: a.fotos?.length ? a.fotos : [
              `assets/img/animal_id_${id}/Foto1.png`,
              `assets/img/animal_id_${id}/Foto2.png`,
              `assets/img/animal_id_${id}/Foto3.png`,
              `assets/img/animal_id_${id}/Foto4.png`
            ]
          } as Animal;
        });
      }),
      catchError(() => of(SEED_ANIMALS)),
    );
  }

  getAnimalById(id: string): Observable<Animal | undefined> {
    return this.getAnimals().pipe(map((animals) => animals.find((animal) => animal.id === id)));
  }

  filterAnimals(animals: Animal[], filters: AnimalFilters): Animal[] {
    const search = filters.search.trim().toLowerCase();

    return animals.filter((animal) => {
      const matchesSearch =
        !search ||
        animal.nombre.toLowerCase().includes(search) ||
        animal.raza.toLowerCase().includes(search) ||
        animal.descripcion.toLowerCase().includes(search);
      const matchesSpecies = filters.especie === 'todos' || animal.especie === filters.especie;
      const matchesAge =
        filters.edad === 'todas' ||
        (filters.edad === 'joven' && animal.edad <= 2) ||
        (filters.edad === 'adulto' && animal.edad > 2 && animal.edad <= 7) ||
        (filters.edad === 'senior' && animal.edad > 7);

      return matchesSearch && matchesSpecies && matchesAge;
    });
  }
  updateAnimalStatus(id: string, estado: 'disponible' | 'adoptado'): Observable<void> {
    if (!this.firestore) {
      // Actualizar en el seed local (solo en memoria)
      const animal = SEED_ANIMALS.find(a => a.id === id);
      if (animal) animal.estado = estado;
      return of(undefined);
    }

    return from(updateDoc(doc(this.firestore, 'animales', id), { estado }));
  }
}
