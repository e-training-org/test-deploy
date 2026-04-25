import { Injectable, Inject, PLATFORM_ID, inject } from '@angular/core';
import { BehaviorSubject, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { ErrorHandler } from '../error-handling/error-handler';
import { environment } from '../../../environments/environment';
import { StorageService } from '../storage';

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
    private storageService: StorageService,
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.authState.next(!!this.storageService.get('authToken'));
    }
  }

  login(email: string, password: string) {
    return this.http
      .post<{ code: number; access_token: string }>(`${this.apiUrl}/login`, { email, password })
      .pipe(
        tap((res) => {
          if (res.access_token) {
            this.storageService.set('authToken', res.access_token);
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
            this.storageService.set('userEmail', data.email);
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
    this.storageService.set('userEmail', email);
    this.authState.next(true);
    this.router.navigate(['']);
  }

  logout() {
    this.storageService.remove('userEmail');
    this.storageService.remove('authToken');
    this.authState.next(false);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
      return !!this.storageService.get('authToken');
  }

  getCurrentUser(): string | null {
   return this.storageService.get('userEmail');
  }
}
