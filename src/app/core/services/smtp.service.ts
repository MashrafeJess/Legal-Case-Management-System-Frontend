import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class SmtpService {
  private url = `${environment.apiUrl}/smtp`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any>(`${this.url}/all`);
  }

  getById(id: number) {
    return this.http.get<any>(`${this.url}/getById/${id}`);
  }

  create(payload: {
    host:        string;
    port:        number;
    username:    string;
    password:    string;
    enableSsl:   boolean;
    senderEmail: string;
  }) {
    return this.http.post<any>(`${this.url}/add`, payload);
  }

  update(payload: {
    smtpId:      number;
    host:        string;
    port:        number;
    username:    string;
    password:    string;
    enableSsl:   boolean;
    senderEmail: string;
  }) {
    return this.http.put<any>(`${this.url}/update`, payload);
  }

  delete(id: number) {
    return this.http.delete<any>(`${this.url}/delete/${id}`);
  }
}
