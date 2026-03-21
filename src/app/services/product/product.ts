import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { IProductList } from '../../../shared/interfaces/products.interface';
import { Observable } from 'rxjs/internal/Observable';
import { ErrorHandler } from '../error-handling/error-handler';
import { environment } from '../../../environments/environment';
import { catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private apiUrl = `${environment.apiUrl}/products`;

  constructor(
    private http: HttpClient,
    private errorHandler: ErrorHandler,
  ) {}

  getAllProducts(): Observable<IProductList[]> {
    const token = localStorage.getItem('authToken');

    if (!token) {
      console.error('No auth token found!');
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http
      .get<IProductList[]>(this.apiUrl, { headers })
      .pipe(catchError(this.errorHandler.handleError));
  }

  getProductById(id: string): Observable<IProductList> {
    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token?.trim()}`,
      'Content-Type': 'application/json',
    });

    return this.http
      .get<IProductList>(`${this.apiUrl}/${id}`, { headers })
      .pipe(catchError(this.errorHandler.handleError));
  }

  createProduct(product: IProductList): Observable<IProductList> {
    const token = localStorage.getItem('authToken');

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    });

    return this.http
      .post<IProductList>(this.apiUrl, product, { headers })
      .pipe(catchError(this.errorHandler.handleError));
  }
}
