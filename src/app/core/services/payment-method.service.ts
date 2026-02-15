import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class PaymentMethodService {
  private url = `${environment.apiUrl}/paymentmethod`;
  constructor(private http: HttpClient) {}
  getAll() { return this.http.get<any>(`${this.url}/getall`); }
}
