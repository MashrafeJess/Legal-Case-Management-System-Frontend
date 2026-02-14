import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class UserService {
  private url = `${environment.apiUrl}/user`;

  constructor(private http: HttpClient) {}

  register(payload: any) {
    return this.http.post<any>(`${this.url}/register`, payload);
  }

  getById(userId: string) {
    return this.http.get<any>(`${this.url}/${userId}`);
  }

  getAll() {
    return this.http.get<any>(`${this.url}/GetAll`);
  }

  update(payload: any) {
    return this.http.put<any>(`${this.url}/update`, payload);
  }

  delete(userId: string) {
    return this.http.delete<any>(`${this.url}/delete/${userId}`);
  }
}
