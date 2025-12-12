import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/Cliente';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  constructor(private http: HttpClient) { }

  list(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(`${environment.url_backend}/customers`);
  }

  view(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${environment.url_backend}/customers/${id}`);
  }

  create(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(`${environment.url_backend}/customers`, cliente);
  }

  update(cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${environment.url_backend}/customers/${cliente.id}`, cliente);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.url_backend}/customers/${id}`);
  }
}
