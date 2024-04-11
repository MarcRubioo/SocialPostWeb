import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";

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
          alert("Registro realizado");
          if (response.responseNo == 200) {
            this.router.navigate(['/login']);
          }
        }
      },
      error => {
        console.log(error)
        alert("Problema al registrar");
      }
    );
  }


  hidePassword: boolean = true;

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
