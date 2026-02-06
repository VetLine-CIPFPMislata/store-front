import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Router } from '@angular/router';
import { LoginRequest } from '../Modelos/LoginRequest';
import { LoginResponse } from '../Modelos/LoginResponse';
import { RegisterRequest } from '../Modelos/RegisterRequest';
import { RegisterResponse } from '../Modelos/RegisterResponse';
import { User } from '../Modelos/User';



@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private urlAuth = '/api/auth';
  private authStatus = new BehaviorSubject<boolean>(this.isAuthenticated());
  public authStatus$ = this.authStatus.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  //ng serve --proxy-config src/proxy.conf.json

  login(credentials: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.urlAuth}/login`, credentials);
  }

  register(registerData: RegisterRequest): Observable<RegisterResponse> {
    return this.http.post<RegisterResponse>(`${this.urlAuth}/register`, registerData);
  }

  logout(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.post(`${this.urlAuth}/logout`, {}, { headers });
  }

  getCurrentUser(): Observable<User> {
    const token = this.getToken();
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });

    return this.http.get<User>(`${this.urlAuth}/me/any`, { headers });
  }

  saveToken(token: string): void {
    localStorage.setItem('authToken', token);
    this.authStatus.next(true);
  }

  getToken(): string | null {
    return localStorage.getItem('authToken');
  }
  saveUserEmail(email: string): void {
    localStorage.setItem('userEmail', email);
  }

  getUserEmail(): string | null {
    return localStorage.getItem('userEmail');
  }

  saveUserName(name: string): void {
    localStorage.setItem('userName', name);
  }

  getUserName(): string | null {
    return localStorage.getItem('userName');
  }

  saveUserId(id: number): void {
    localStorage.setItem('userId', id.toString());
  }

  getUserId(): number | null {
    const id = localStorage.getItem('userId');
    return id ? parseInt(id, 10) : null;
  }

  clearAuth(): void {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userName');
    localStorage.removeItem('userId');
    this.authStatus.next(false);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  }

}
