import { inject, Injectable } from '@angular/core';
import { doc, docData, Firestore, setDoc } from '@angular/fire/firestore';
import { catchError, from, map, Observable, of, switchMap } from 'rxjs';

import { Usuario } from '../models/usuario.model';

const USERS_KEY = 'pwm_refugio_users';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly firestore = inject(Firestore, { optional: true });

  getProfile(uid: string): Observable<Usuario | null> {
    if (!this.firestore) {
      return of(this.getLocalUser(uid));
    }

    return docData(doc(this.firestore, 'usuarios', uid), { idField: 'uid' }).pipe(
      map((usuario) => (usuario ? (usuario as Usuario) : null)),
      catchError(() => of(this.getLocalUser(uid))),
    );
  }

  saveProfile(usuario: Usuario): Observable<Usuario> {
    if (!this.firestore) {
      this.saveLocalUser(usuario);
      return of(usuario);
    }

    return from(setDoc(doc(this.firestore, 'usuarios', usuario.uid), usuario, { merge: true })).pipe(
      switchMap(() => {
        this.saveLocalUser(usuario);
        return of(usuario);
      }),
      catchError(() => {
        this.saveLocalUser(usuario);
        return of(usuario);
      }),
    );
  }

  getLocalUserByEmail(email: string): Usuario | null {
    const normalizedEmail = email.trim().toLowerCase();
    return Object.values(this.getLocalUsers()).find((user) => user.email.toLowerCase() === normalizedEmail) ?? null;
  }

  private getLocalUser(uid: string): Usuario | null {
    return this.getLocalUsers()[uid] ?? null;
  }

  private saveLocalUser(usuario: Usuario): void {
    const users = this.getLocalUsers();
    users[usuario.uid] = usuario;
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  }

  private getLocalUsers(): Record<string, Usuario> {
    const rawUsers = localStorage.getItem(USERS_KEY);
    if (!rawUsers) {
      return {};
    }

    try {
      return JSON.parse(rawUsers) as Record<string, Usuario>;
    } catch {
      return {};
    }
  }
}
