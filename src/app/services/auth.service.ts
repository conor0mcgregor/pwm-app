import { inject, Injectable } from '@angular/core';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile as updateFirebaseProfile,
} from '@angular/fire/auth';
import { BehaviorSubject, catchError, from, map, Observable, of, switchMap, tap } from 'rxjs';

import { Usuario } from '../models/usuario.model';
import { UserService } from './user.service';

const SESSION_KEY = 'pwm_refugio_current_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly auth = inject(Auth, { optional: true });
  private readonly userService = inject(UserService);
  private readonly currentUserSubject = new BehaviorSubject<Usuario | null>(this.loadSession());

  readonly currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    if (!this.auth) {
      return;
    }

    authState(this.auth)
      .pipe(
        switchMap((firebaseUser) => {
          if (!firebaseUser) {
            return of(null);
          }

          return this.userService.getProfile(firebaseUser.uid).pipe(
            map(
              (profile) =>
                profile ?? {
                  uid: firebaseUser.uid,
                  nombre: firebaseUser.displayName ?? '',
                  apellidos: '',
                  dni: '',
                  direccion: '',
                  telefono: '',
                  email: firebaseUser.email ?? '',
                },
            ),
          );
        }),
      )
      .subscribe((usuario) => this.setSession(usuario));
  }

  get currentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  login(email: string, password: string): Observable<Usuario> {
    if (!this.auth) {
      return of(this.loginLocally(email));
    }

    return from(signInWithEmailAndPassword(this.auth, email, password)).pipe(
      switchMap((credential) => this.resolveFirebaseUser(credential.user.uid, credential.user.email ?? email)),
      catchError(() => of(this.loginLocally(email))),
      tap((usuario) => this.setSession(usuario)),
    );
  }

  register(data: Usuario & { password: string }): Observable<Usuario> {
    const usuario: Usuario = {
      uid: data.uid || `local_${Date.now()}`,
      nombre: data.nombre,
      apellidos: data.apellidos,
      dni: data.dni,
      direccion: data.direccion,
      telefono: data.telefono,
      email: data.email,
    };

    if (!this.auth) {
      return this.userService.saveProfile(usuario).pipe(tap((savedUser) => this.setSession(savedUser)));
    }

    return from(createUserWithEmailAndPassword(this.auth, data.email, data.password)).pipe(
      switchMap((credential) => {
        const firebaseUser = credential.user;
        const profile = { ...usuario, uid: firebaseUser.uid, email: firebaseUser.email ?? usuario.email };

        return from(updateFirebaseProfile(firebaseUser, { displayName: `${profile.nombre} ${profile.apellidos}`.trim() })).pipe(
          switchMap(() => this.userService.saveProfile(profile)),
        );
      }),
      catchError(() => this.userService.saveProfile(usuario)),
      tap((savedUser) => this.setSession(savedUser)),
    );
  }

  updateUser(data: Partial<Usuario>): Observable<Usuario> {
    const currentUser = this.currentUser;
    if (!currentUser) {
      throw new Error('No hay usuario autenticado');
    }

    const updatedUser = { ...currentUser, ...data };
    return this.userService.saveProfile(updatedUser).pipe(tap((usuario) => this.setSession(usuario)));
  }

  logout(): Observable<void> {
    this.setSession(null);
    if (!this.auth) {
      return of(undefined);
    }

    return from(signOut(this.auth)).pipe(catchError(() => of(undefined)));
  }

  private resolveFirebaseUser(uid: string, email: string): Observable<Usuario> {
    return this.userService.getProfile(uid).pipe(
      switchMap((profile) => {
        const usuario =
          profile ??
          ({
            uid,
            nombre: '',
            apellidos: '',
            dni: '',
            direccion: '',
            telefono: '',
            email,
          } satisfies Usuario);

        return this.userService.saveProfile(usuario);
      }),
    );
  }

  private loginLocally(email: string): Usuario {
    const existingUser = this.userService.getLocalUserByEmail(email);
    const usuario =
      existingUser ??
      ({
        uid: `local_${Date.now()}`,
        nombre: 'Usuario',
        apellidos: 'Demo',
        dni: '',
        direccion: '',
        telefono: '',
        email,
      } satisfies Usuario);

    this.userService.saveProfile(usuario).subscribe();
    this.setSession(usuario);
    return usuario;
  }

  private setSession(usuario: Usuario | null): void {
    this.currentUserSubject.next(usuario);
    if (usuario) {
      localStorage.setItem(SESSION_KEY, JSON.stringify(usuario));
      return;
    }

    localStorage.removeItem(SESSION_KEY);
  }

  private loadSession(): Usuario | null {
    const rawSession = localStorage.getItem(SESSION_KEY);
    if (!rawSession) {
      return null;
    }

    try {
      return JSON.parse(rawSession) as Usuario;
    } catch {
      return null;
    }
  }
}
