import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Restaurante } from '../models/Restaurante';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RestauranteService {

  constructor(private http: HttpClient) { }

  list(): Observable<Restaurante[]> {
    return this.http.get<Restaurante[]>(`${environment.url_backend}/restaurantes`);
  }

  view(id: number): Observable<Restaurante> {
    return this.http.get<Restaurante>(`${environment.url_backend}/restaurantes/${id}`);
  }

  create(restaurante: Restaurante): Observable<Restaurante> {
    return this.http.post<Restaurante>(`${environment.url_backend}/restaurantes`, restaurante);
  }

  update(restaurante: Restaurante): Observable<Restaurante> {
    return this.http.put<Restaurante>(`${environment.url_backend}/restaurantes/${restaurante.id}`, restaurante);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.url_backend}/restaurantes/${id}`);
  }
}
