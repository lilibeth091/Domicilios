import { Injectable } from "@angular/core";
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
} from "@angular/common/http";
import { catchError, Observable, throwError } from "rxjs";
import { SecurityService } from "../services/security.service";
import { Router } from "@angular/router";
import Swal from "sweetalert2";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(
    private securityService: SecurityService,
    private router: Router
  ) {}

  //Codigo de sobre escritura
  //Necesito ver al usuario, le pregunto al servicio  - usamos variable reactiva vuando necesito que haya un cambio ismultaneo - cuando tengo que estar pendiende del comportamiento de una variable
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const theUser = this.securityService.activeUserSession;
    const token = theUser?.token;

    // Si la solicitud es para la ruta de "login" o validación de token, no adjuntes el token
    if (
      request.url.includes("/login") ||
      request.url.includes("/token-validation")
    ) {
      return next.handle(request).pipe(
        catchError((err: HttpErrorResponse) => {
          return throwError(() => err);
        })
      );
    }

    // Clonar la solicitud solo si existe token
    let authRequest = request;
    if (token) {
      authRequest = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }

    return next.handle(authRequest).pipe(
      catchError((err: HttpErrorResponse) => {
        if (err.status === 401) {
          Swal.fire({
            title: "No está autorizado para esta operación",
            icon: "error",
            timer: 5000,
          });
          // limpiar sesión y redirigir al login
          try {
            this.securityService.logout();
          } catch (e) {}
          this.router.navigateByUrl("/login");
        } else if (err.status === 400) {
          Swal.fire({
            title: "Existe un error, contacte al administrador",
            icon: "error",
            timer: 5000,
          });
        }

        return throwError(() => err);
      })
    );
  }
}
