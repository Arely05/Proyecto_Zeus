import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs'; 
import { Product } from '../models/product';

@Injectable({ providedIn: 'root' })
export class ProductService {
  
  private apiUrl = 'http://localhost:4000/api/catalogo';

  constructor(private http: HttpClient) {}

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/producto`);
  }

  getAdminProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/producto-admin`);
  }

  updateStock(id: number, stock: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-stock`, { id, stock });
  }

  updateProductFull(productData: FormData): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-full`, productData);
  }

  createProduct(productData: FormData): Observable<any> {
    return this.http.post(`${this.apiUrl}/create`, productData);
  }

  updateStatus(id: number, activo: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/update-status`, { id, activo });
  }
}