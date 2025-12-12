import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Restaurante } from "../models/Restaurante";
import { environment } from "src/environments/environment";

@Injectable({
  providedIn: "root",
})
export class RestauranteService {
  constructor(private http: HttpClient) {}

  list(): Observable<Restaurante[]> {
    return this.http
      .get<any>(`${environment.url_backend}/restaurantes`)
      .pipe(map((body) => this.unwrapResponse<Restaurante[]>(body)));
  }

  view(id: number): Observable<Restaurante> {
    return this.http
      .get<any>(`${environment.url_backend}/restaurantes/${id}`)
      .pipe(map((body) => this.unwrapResponse<Restaurante>(body)));
  }

  create(restaurante: Restaurante): Observable<Restaurante> {
    return this.http
      .post<any>(`${environment.url_backend}/restaurantes`, restaurante)
      .pipe(map((body) => this.unwrapResponse<Restaurante>(body)));
  }

  update(restaurante: Restaurante): Observable<Restaurante> {
    return this.http
      .put<any>(
        `${environment.url_backend}/restaurantes/${restaurante.id}`,
        restaurante
      )
      .pipe(map((body) => this.unwrapResponse<Restaurante>(body)));
  }

  delete(id: number): Observable<any> {
    return this.http
      .delete<any>(`${environment.url_backend}/restaurantes/${id}`)
      .pipe(map((body) => this.unwrapResponse<any>(body)));
  }

  private unwrapResponse<T>(body: any): T {
    // Backend sometimes returns a JSON array [payload, status_code]
    if (
      Array.isArray(body) &&
      body.length === 2 &&
      typeof body[1] === "number"
    ) {
      return body[0] as T;
    }
    return body as T;
  }
}
