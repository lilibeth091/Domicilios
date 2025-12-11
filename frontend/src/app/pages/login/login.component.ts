import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { User } from 'src/app/models/User';

import { SecurityService } from 'src/app/services/security.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  user: User
  
  constructor(private securityService: SecurityService, private router: Router) {
    this.user = { email: "", password: "" }
  }

  login() {
    this.securityService.login(this.user).subscribe({
      next: (data) => {
        this.securityService.saveSession(data)
        this.router.navigate(["dashboard"])
      },
      error: (error) => {
        Swal.fire("Autenticación Inválida", "Usuario o contraseña inválido", "error")
      }
    })
  }

  async loginWithGoogle() {
    try {
      const result = await this.securityService.loginWithGoogle();
      
      if (result.success) {
        Swal.fire({
          title: '¡Bienvenido!',
          text: `Hola ${result.user.name}`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        });
        this.router.navigate(["dashboard"]);
      } else {
        Swal.fire("Error", "No se pudo iniciar sesión con Google", "error");
      }
    } catch (error) {
      console.error('Error en login con Google:', error);
      Swal.fire("Error", "Ocurrió un error al iniciar sesión con Google", "error");
    }
  }

  ngOnInit() {
  }
  
  ngOnDestroy() {
  }
}