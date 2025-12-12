import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Orden } from '../models/Orden';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdenService {

  constructor(private http: HttpClient) { }

  list(): Observable<Orden[]> {
    return this.http.get<Orden[]>(`${environment.url_backend}/orders`);
  }

  view(id: number): Observable<Orden> {
    return this.http.get<Orden>(`${environment.url_backend}/orders/${id}`);
  }

  create(orden: Orden): Observable<Orden> {
    return this.http.post<Orden>(`${environment.url_backend}/orders`, orden);
  }

  update(orden: Orden): Observable<Orden> {
    return this.http.put<Orden>(`${environment.url_backend}/orders/${orden.id}`, orden);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.url_backend}/orders/${id}`);
  }
}
