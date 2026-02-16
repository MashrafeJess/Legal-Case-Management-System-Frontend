import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class CaseTypeService {
  private url = `${environment.apiUrl}/type`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any>(`${this.url}/getAll`);
  }

  getById(id: number) {
    return this.http.get<any>(`${this.url}/${id}`);
  }

  create(payload: {
    caseTypeName:        string;
    caseTypeDescription: string;
  }) {
    return this.http.post<any>(`${this.url}/create`, payload);
  }

  update(payload: {
    caseTypeId:          number;
    caseTypeName:        string;
    caseTypeDescription: string;
  }) {
    return this.http.put<any>(`${this.url}/update`, payload);
  }

  delete(id: number) {
    return this.http.delete<any>(`${this.url}/delete/${id}`);
  }
}
