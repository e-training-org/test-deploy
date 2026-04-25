import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ErrorHandler } from './error-handler';
import id from '@angular/common/locales/extra/id';
import { StorageService } from './storage';

export interface Category {
  id?: number;
  name: string;
  description?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl = `${environment.apiUrl}/categories`;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandler,
    private storageService: StorageService,
  ) {}

  getCategories(): Observable<Category[]> {
    return this.http
      .get<Category[]>(this.apiUrl, {
        headers: {
          Authorization: `Bearer ${this.storageService.get('authToken')}`,
        },
      })
      .pipe(catchError(this.errorHandler.handleError));
  }

  getCategory(id: number): Observable<Category> {
    return this.http
      .get<Category>(`${this.apiUrl}/${id}`, {
        headers: {
          Authorization: `Bearer ${this.storageService.get('authToken')}`,
        },
      })
      .pipe(catchError(this.errorHandler.handleError));
  }

  createCategory(category: Category): Observable<Category> {
    return this.http
      .post<Category>(this.apiUrl, category, {
        headers: {
          Authorization: `Bearer ${this.storageService.get('authToken')}`,
        },
      })
      .pipe(catchError(this.errorHandler.handleError));
  }

  updateCategory(id: number, category: Category): Observable<Category> {
    return this.http
      .put<Category>(`${this.apiUrl}/${id}`, category, {
        headers: {
          Authorization: `Bearer ${this.storageService.get('authToken')}`,
        },
      })
      .pipe(catchError(this.errorHandler.handleError));
  }

  deleteCategory(id: number): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`, {
        headers: {
          Authorization: `Bearer ${this.storageService.get('authToken')}`,
        },
      })
      .pipe(catchError(this.errorHandler.handleError));
  }
}
