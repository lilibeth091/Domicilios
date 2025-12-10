import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/User';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SecurityService {

  //Patron de diseño Observer - programacion fina, no lo hace la IA - 28 recomendaciones 
  //BehaviorSubject - Desde cual parte de la aplicación se puede acceder a la información del usuario es como un Obsever 
  theUser = new BehaviorSubject<User>(new User);
  constructor(private http: HttpClient) { 
    this.verifyActualSession() //
  }

  /**
  * Realiza la petición al backend con el correo y la contraseña
  * para verificar si existe o no en la plataforma
  * @param infoUsuario JSON con la información de correo y contraseña
  * @returns Respuesta HTTP la cual indica si el usuario tiene permiso de acceso
  */
  login(user: User): Observable<any> {
    return this.http.post<any>(`${environment.url_ms_security}/login`, user);
  }
  /*
  Guardar la información de usuario en el - local storage - 
  */
  saveSession(dataSesion: any) {
    let data: User = {
      id: dataSesion["id"],
      name: dataSesion["name"],
      email: dataSesion["email"],
      password: "",
      token: dataSesion["token"]
    };
    localStorage.setItem('sesion', JSON.stringify(data));
    this.setUser(data); // Variable global reactiva 
  }
  /**
    * Permite actualizar la información del usuario
    * que acabó de validarse correctamente
    * @param user información del usuario logueado
  */
  setUser(user: User) {
    this.theUser.next(user); //Next = publisher - propio del behaviorSubject - Todos los que esten pendientes de mi digales que cambie 
  }
  /**
  * Permite obtener la información del usuario
  * con datos tales como el identificador y el token
  * @returns
  */
  getUser() {
    return this.theUser.asObservable();
  }
  /**
    * Permite obtener la información de usuario
    * que tiene la función activa y servirá
    * para acceder a la información del token
*/
  public get activeUserSession(): User {
    return this.theUser.value;
  }


  /**
  * Permite cerrar la sesión del usuario
  * que estaba previamente logueado
  */
  logout() {
    localStorage.removeItem('sesion');
    this.setUser(new User());
  }
  /**
  * Permite verificar si actualmente en el local storage
  * existe información de un usuario previamente logueado
  */
  verifyActualSession() {
    let actualSesion = this.getSessionData();
    if (actualSesion) {
      this.setUser(JSON.parse(actualSesion)); //Al usuario que se logueo actualicele la informacion  - si esta linea no esta cuando el usuario salga sin cerrar sesion despues cuando vuelva a entrar no le va a funcionar 
    }
  }
  /**
  * Verifica si hay una sesion activa en el local storage
  * @returns
  */
  existSession(): boolean {
    let sesionActual = this.getSessionData();
    return (sesionActual) ? true : false;
  }
  /**
  * Permite obtener los dato de la sesión activa en el
  * local storage
  * @returns
  */
  getSessionData() {
    let sesionActual = localStorage.getItem('sesion');
    return sesionActual;
  }
}



//Hacer el logout en el sidebar y navbar