import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private url = `${environment.apiUrl}/payment`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any>(`${this.url}/getall`);
  }

  getByCaseId(caseId: number) {
    return this.http.get<any>(`${this.url}/case/${caseId}`);
  }

  getByPaymentId(paymentId: string) {
    return this.http.get<any>(`${this.url}/${paymentId}`);
  }

  initiate(payload: {
    caseId:          number;
    hearingId?:      number | null;
    amount:          number;
    paymentMethodId: number;
    customerName:    string;
    customerEmail:   string;
    customerPhone:   string;
    customerAddress: string;
  }) {
    return this.http.post<any>(`${this.url}/initiate`, payload);
  }
}
