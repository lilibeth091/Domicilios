import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../models/Producto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  constructor(private http: HttpClient) { }

  list(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${environment.url_backend}/products`);
  }

  view(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${environment.url_backend}/products/${id}`);
  }

  create(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(`${environment.url_backend}/products`, producto);
  }

  update(producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${environment.url_backend}/products/${producto.id}`, producto);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.url_backend}/products/${id}`);
  }
}
