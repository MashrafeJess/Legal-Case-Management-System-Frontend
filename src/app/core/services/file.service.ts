import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environment/environment';

@Injectable({ providedIn: 'root' })
export class FileService {
  private url = `${environment.apiUrl}/file`;
  constructor(private http: HttpClient) {}

  download(fileId: string) {
    return this.http.get(`${this.url}/download/${fileId}`, {
      responseType: 'blob'
    });
  }

  delete(fileId: string) {
    return this.http.delete<any>(`${this.url}/delete/${fileId}`);
  }
}
