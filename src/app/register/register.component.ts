import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  firstName: string = '';
  email: string = '';
  password: string = '';
  phoneNumber: string = '';

  hidePassword: boolean = true;

  constructor(private router: Router, private http: HttpClient) {
  }

  onSubmit() {
    console.log('Usuario:', this.firstName);
    console.log('Contraseña:', this.password);
    console.log('Email:', this.email);
    console.log('Phone:', this.phoneNumber);

    const datos = {
      email: this.email,
      password: this.password,
      firstName: this.firstName,
      phoneNumber: this.phoneNumber
    };

    const headers = {
      headers: new HttpHeaders({
        'Content-Type': "application/json"
      })
    }

    this.http.post<any>('http://localhost:8080/api/users', datos, headers).subscribe(
      response => {
        if (response) {
          console.log(response)
          if (response.responseNo == 200) {
            Swal.fire({
              icon: 'success',
              title: 'Registro realizado',
              text: '¡Bienvenido!',
              confirmButtonText: 'Aceptar',
              customClass: {
                confirmButton: 'swal-confirm-button'
              }
            }).then(() => {
              localStorage.setItem("idToken", response.data[0].id);
              localStorage.setItem("email", this.email);
              this.router.navigate(['/login']);
            });
          }
        }
      },
      error => {
        console.log(error);
        Swal.fire({
          icon: 'error',
          title: 'Problema al registrar',
          text: 'Por favor, inténtelo de nuevo.',
          confirmButtonText: 'Aceptar',
          customClass: {
            confirmButton: 'swal-confirm-button'
          }
        });
      }
    );
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
