import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';
import { map } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PaymentMethodService {
  private url = `${environment.apiUrl}/paymentmethod`;

  constructor(private http: HttpClient) {}

  getAll() {
    return this.http.get<any>(`${this.url}/getall`);
  }

  getById(id: number) {
    return this.http.get<any>(`${this.url}/${id}`);
  }

  create(payload: { paymentMethodName: string }) {
    return this.http.post<any>(`${this.url}/add`, payload);
  }

  update(payload: {
    paymentMethodId:   number;
    paymentMethodName: string;
    paymentStatus:     boolean;
  }) {
    return this.http.put<any>(`${this.url}/update`, payload);
  }

  delete(id: number) {
    return this.http.delete<any>(`${this.url}/delete/${id}`);
  }

  // ✅ Get cash method id from all methods
  getCashMethodId() {
    return this.getAll().pipe(
      map((res: any) => {
        if (!res.success) return null;
        const cash = res.data.find((m: any) =>
          m.paymentMethodName.toLowerCase().includes('cash')
        );
        return cash?.paymentMethodId ?? null;
      })
    );
  }

  // ✅ Get only online methods (exclude cash)
  getOnlineMethods() {
    return this.getAll().pipe(
      map((res: any) => {
        if (!res.success) return [];
        return res.data.filter((m: any) =>
          !m.paymentMethodName.toLowerCase().includes('cash')
          && m.paymentStatus
        );
      })
    );
  }
}
