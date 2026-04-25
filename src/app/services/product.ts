import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { environment } from '../../environments/environment';
import { ErrorHandler } from './error-handler';
import { StorageService } from './storage';
import { IProductList } from '../../shared/interfaces/products.interface';

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
    return this.http
      .get<IProductList[]>(this.apiUrl)
      .pipe(catchError(this.errorHandler.handleError));
  }

  getProductById(id: string): Observable<IProductList> {
    return this.http
      .get<IProductList>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.errorHandler.handleError));
  }

  createProduct(product: IProductList): Observable<IProductList> {
    return this.http
      .post<IProductList>(this.apiUrl, product)
      .pipe(catchError(this.errorHandler.handleError));
  }

  updateProduct(id: string, product: IProductList): Observable<IProductList> {
    return this.http
      .put<IProductList>(`${this.apiUrl}/${id}`, product)
      .pipe(catchError(this.errorHandler.handleError));
  }

  deleteProduct(id: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/${id}`)
      .pipe(catchError(this.errorHandler.handleError));
  }
}
