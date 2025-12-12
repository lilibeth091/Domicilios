import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Menu } from '../models/Menu';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MenuService {

  constructor(private http: HttpClient) { }

  list(): Observable<Menu[]> {
    return this.http.get<Menu[]>(`${environment.url_backend}/menus`);
  }

  view(id: number): Observable<Menu> {
    return this.http.get<Menu>(`${environment.url_backend}/menus/${id}`);
  }

  create(menu: Menu): Observable<Menu> {
    return this.http.post<Menu>(`${environment.url_backend}/menus`, menu);
  }

  update(menu: Menu): Observable<Menu> {
    return this.http.put<Menu>(`${environment.url_backend}/menus/${menu.id}`, menu);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${environment.url_backend}/menus/${id}`);
  }
}
