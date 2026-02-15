import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class CaseTypeService {
  private url = `${environment.apiUrl}/casetype`;
  constructor(private http: HttpClient) {}
  getAll() { return this.http.get<any>(`${this.url}/all`); }
}
