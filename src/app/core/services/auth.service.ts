import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from '../../../environment/environment';
@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly TOKEN_KEY = 'lcms_token';
  private readonly USER_KEY  = 'lcms_user';

  // Signal for reactive auth state
  isLoggedIn = signal<boolean>(this.hasToken());
  currentUser = signal<any>(this.getUser());

  constructor(private http: HttpClient, private router: Router) {}

  login(email: string, password: string) {
    return this.http.post<any>(`${environment.apiUrl}/user/login`, { email, password });
  }

  saveToken(token: string, user: any) {
    localStorage.setItem(this.TOKEN_KEY, token);
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
    this.isLoggedIn.set(true);
    this.currentUser.set(user);
  }

  logout() {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.isLoggedIn.set(false);
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getUser(): any {
    const user = localStorage.getItem(this.USER_KEY);
    return user ? JSON.parse(user) : null;
  }

  getRole(): string {
    return this.getUser()?.role ?? '';
  }

  private hasToken(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }
  getUserId(): string {
  const user = this.getUser();
  return user?.userId ?? '';
}
}
