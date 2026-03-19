import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { ErrorHandler } from '../error-handling/error-handler';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private authState = new BehaviorSubject<boolean>(false);
  private apiUrl = `${environment.apiUrl}/auth`;
  isAuthenticated$ = this.authState.asObservable();

  constructor(
    private errorHandler: ErrorHandler,
    private http: HttpClient,
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.authState.next(!!localStorage.getItem('userEmail'));
    }
  }

  login(email: string, password: string) {
    return this.http
      .post<{ code: number; access_token: string }>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((res) => {
          if (res.access_token) {
            localStorage.setItem('authToken', res.access_token);
            this.authState.next(true);
            this.router.navigate(['']);
          }
        }),
        catchError((err) => {
          this.errorHandler.handleError(err);
          return throwError(() => err);
        }),
      );
  }

  signup(data: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber?: string;
    password: string;
  }) {
    return this.http
      .post<{ success: boolean; message?: string; code: number }>(`${this.apiUrl}/signup`, data)
      .pipe(
        tap((res) => {
          console.log('Response', res);
          if (res.code === 0) {
            localStorage.setItem('userEmail', data.email);
            this.authState.next(true);
            this.router.navigate(['/login']);
          }
        }),
        catchError((err) => {
          this.errorHandler.handleError(err);
          return throwError(() => err);
        }),
      );
  }

  setUser(email: string) {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('userEmail', email);
      this.authState.next(true);
      this.router.navigate(['']);
    }
  }

  logout() {
  if (isPlatformBrowser(this.platformId)) {
    localStorage.removeItem('userEmail');
    localStorage.removeItem('authToken');
    this.authState.next(false);
    this.router.navigate(['/login']);
  }
}

  isLoggedIn(): boolean {
    return isPlatformBrowser(this.platformId) && !!localStorage.getItem('userEmail');
  }

  getCurrentUser(): string | null {
    return isPlatformBrowser(this.platformId) ? localStorage.getItem('userEmail') : null;
  }
}
