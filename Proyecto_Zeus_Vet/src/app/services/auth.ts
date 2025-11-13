import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, map, catchError, throwError } from 'rxjs';
import { User } from '../models/user';
import { HttpClient } from '@angular/common/http'; 
import { Order } from '../models/order'; 

@Injectable({ providedIn: 'root' })
export class AuthService {
 
  private apiUrl = 'http://localhost:4000/api/auth'; 
  private passwordApiUrl = 'http://localhost:4000/api/password';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  

  constructor(private http: HttpClient) {} 

  register(nombre: string, email: string, contrasena: string, direccion: string): Observable<User> {
   
    return this.http.post<User>(`${this.apiUrl}/register`, {
      nombre,
      email,
      contrasena,
      direccion
    }).pipe(
      tap(user => {
        this.currentUserSubject.next(user);
      }),
      catchError(this.handleError) 
    );
  }

  login(email: string, contrasena: string): Observable<User> {
   
    return this.http.post<User>(`${this.apiUrl}/login`, {
      email,
      contrasena
    }).pipe(
      tap(user => {
      this.currentUserSubject.next(user);
      }),
      catchError(this.handleError)
    );
  }

  logout(): void {
    this.currentUserSubject.next(null);
  }

  get currentUserValue(): User | null {
    return this.currentUserSubject.value;
  }

  private handleError(error: any) {
    console.error('Error en AuthService:', error);
    return throwError(() => error); 
  }

  updateUser(user: User): Observable<User> {
    const url = `${this.apiUrl}/user/${user.id}`;

    return this.http.put<User>(url, { 
      nombre: user.nombre, 
      email: user.email, 
      direccion: user.direccion 
    }).pipe(
      tap(updatedUser => {
        this.currentUserSubject.next(updatedUser);
      }),
      catchError(this.handleError)
    );
  }

  deleteUser(userId: number): Observable<any> {
    const url = `${this.apiUrl}/user/${userId}`;

    return this.http.delete(url).pipe(
      tap(() => {
      this.logout();
      }),
      catchError(this.handleError)
    );
  }
 
  getOrderHistory(userId: number): Observable<Order[]> {
    const url = `${this.apiUrl}/history/${userId}`;

    return this.http.get<Order[]>(url).pipe(
      catchError(this.handleError)
    );
  }

    requestPasswordReset(email: string): Observable<any> {
            return this.http.post(`${this.passwordApiUrl}/request`, { email }).pipe(
            map(res => res),
            catchError(this.handleError)  
          );
    }
 
    resetPassword(token: string, nuevaContrasena: string): Observable<any> {
        return this.http.post(`${this.passwordApiUrl}/reset/${token}`, { nuevaContrasena }).pipe(
            map(res => res),
            catchError(this.handleError)
        );
    }

}