import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

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

  constructor(private http: HttpClient) {}

  getCategories(): Observable<Category[]> {
    const token = localStorage.getItem('access_token');
    return this.http.get<Category[]>(this.apiUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  getCategory(id: number): Observable<Category> {
    const token = localStorage.getItem('access_token');
    return this.http.get<Category>(`${this.apiUrl}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  createCategory(category: Category): Observable<Category> {
    const token = localStorage.getItem('access_token');
    return this.http.post<Category>(this.apiUrl, category, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  updateCategory(id: number, category: Category): Observable<Category> {
    const token = localStorage.getItem('access_token');
    return this.http.put<Category>(`${this.apiUrl}/${id}`, category, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }

  deleteCategory(id: number): Observable<void> {
    const token = localStorage.getItem('access_token');
    return this.http.delete<void>(`${this.apiUrl}/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
  }
}
