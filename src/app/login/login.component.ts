import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Auth, signInWithEmailAndPassword } from '@angular/fire/auth';
import Swal from 'sweetalert2';
import { AdminServiceService } from "../admin-service.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  hidePassword: boolean = true;

  constructor(private router: Router, private http: HttpClient,
              private auth: Auth, private adminService: AdminServiceService) {
  }

  async onSubmit() {
    console.log('Usuario:', this.username);
    console.log('Contraseña:', this.password);

    try {
      // Inicia sesión con correo electrónico y contraseña usando AngularFireAuth
      const userCredential = await signInWithEmailAndPassword(this.auth, this.username, this.password);

      // Si el inicio de sesión es exitoso, obtén el token de autenticación y el correo electrónico del usuario
      if (userCredential && userCredential.user) {
        console.log('Inicio de sesión exitoso');
        const token = await userCredential.user.getIdToken();
        const email = userCredential.user.email;

        // Almacena el token y el correo electrónico en el localStorage
        localStorage.setItem("idToken", token);
        localStorage.setItem("email", email);

        // Configura los encabezados para la solicitud HTTP
        const headers = {
          headers: new HttpHeaders({
            'Content-Type': "application/json",
            "idToken": token,
          })
        }

        // Realiza la solicitud HTTP al servidor
        this.http.post<any>("http://localhost:8080/api/users/login",
          {
            email: this.username,
            password: this.password,
            firstName: ""
          }, headers)
          .subscribe(
            response => {
              if (response) {
                console.log("response: ", response);
                // Redirige al usuario a la página de inicio si el inicio de sesión es correcto
                if (response.responseNo == 200) {
                  // Mostrar SweetAlert2
                  Swal.fire({
                    icon: 'success',
                    title: 'Inicio de sesión exitoso',
                    text: '¡Bienvenido!',
                    confirmButtonText: 'Aceptar',
                    customClass: {
                      confirmButton: 'swal-confirm-button'
                    }
                  }).then(() => {
                    // Redirige al usuario a la página de inicio
                    this.adminService.admin = false;
                    this.router.navigate(['/home']);
                  });
                }
              }
            },
            error => {
              console.error('Error al iniciar sesión:', error);
              // Mostrar SweetAlert2 en caso de error
              Swal.fire({
                icon: 'error',
                title: 'Error al iniciar sesión',
                text: 'Por favor, verifique sus credenciales.',
                confirmButtonText: 'Aceptar',
                customClass: {
                  confirmButton: 'swal-confirm-button'
                }
              });
            }
          );
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      // Mostrar SweetAlert2 en caso de error
      Swal.fire({
        icon: 'error',
        title: 'Error al iniciar sesión',
        text: 'Por favor, verifique sus credenciales.',
        confirmButtonText: 'Aceptar',
        customClass: {
          confirmButton: 'swal-confirm-button'
        }
      });
    }
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
    const passwordInput = document.getElementById('password') as HTMLInputElement;
    if (this.hidePassword) {
      passwordInput.type = 'password';
    } else {
      passwordInput.type = 'text';
    }
  }
}
