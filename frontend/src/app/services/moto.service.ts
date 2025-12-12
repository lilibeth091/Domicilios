import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Moto } from '../models/Moto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MotoService {

  constructor(private http: HttpClient) { }

  list(): Observable<Moto[]> {
    return this.http.get<Moto[]>(`${environment.url_backend}/motorcycles`);
  }

  view(id: number): Observable<Moto> {
    return this.http.get<Moto>(`${environment.url_backend}/motorcycles/${id}`);
  }

  create(moto: Moto): Observable<Moto> {
    return this.http.post<Moto>(`${environment.url_backend}/motorcycles`, moto);
  }

  update(moto: Moto): Observable<Moto> {
    return this.http.put<Moto>(`${environment.url_backend}/motorcycles/${moto.id}`, moto);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.url_backend}/motorcycles/${id}`);
  }
}
