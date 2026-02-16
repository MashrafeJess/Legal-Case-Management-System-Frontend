import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class HearingService {
  private url = `${environment.apiUrl}/hearing`;

  constructor(private http: HttpClient) {}

  getByCaseId(caseId: number) {
    return this.http.get<any>(`${this.url}/by-case/${caseId}`);
  }

  getById(hearingId: number) {
    return this.http.get<any>(`${this.url}/${hearingId}`);
  }

  getAll() {
    return this.http.get<any>(`${this.url}/getall`);
  }

  create(payload: {
    caseId:      number;
    hearingDate: string;
    isGoing:     boolean;
    isPaid:      boolean;
  }) {
    return this.http.post<any>(`${this.url}/add`, payload);
  }

  update(payload: {
    hearingID:   number;
    caseId:      number;
    hearingDate: string;
    isGoing:     boolean;
    isPaid:      boolean;
  }) {
    return this.http.put<any>(`${this.url}/update`, payload);
  }

  delete(hearingId: number) {
    return this.http.delete<any>(`${this.url}/delete/${hearingId}`);
  }
}
