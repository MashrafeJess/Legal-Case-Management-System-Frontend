import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class CaseService {
  private url = `${environment.apiUrl}/case`;

  constructor(private http: HttpClient) {}

  getAll()                   { return this.http.get<any>(`${this.url}/All`); }
  getById(id: number)        { return this.http.get<any>(`${this.url}/getbyid/${id}`); }
  getByLawyer(lawyerId: string) {
    return this.http.get<any>(`${this.url}/getcasebylawyer/${lawyerId}`);
  }
  create(fd: FormData)       { return this.http.post<any>(`${this.url}/create`, fd); }
  update(fd: FormData)       { return this.http.put<any>(`${this.url}/update`, fd); }
  delete(id: number)         { return this.http.delete<any>(`${this.url}/delete/${id}`); }
}
