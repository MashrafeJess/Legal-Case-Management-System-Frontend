import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class CaseService {
  private url = `${environment.apiUrl}/case`;

  constructor(private http: HttpClient) {}

  getAll()            { return this.http.get<any>(`${this.url}/getall`); }
  getById(id: number) { return this.http.get<any>(`${this.url}/getById/${id}`); }

  create(formData: FormData) {
    return this.http.post<any>(`${this.url}/create`, formData);
  }

  update(formData: FormData) {
    return this.http.put<any>(`${this.url}/update`, formData);
  }

  delete(id: number) {
    return this.http.delete<any>(`${this.url}/delete/${id}`);
  }
}
