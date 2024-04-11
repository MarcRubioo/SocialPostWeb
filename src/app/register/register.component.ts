import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  username: string = '';
  gmail: string = '';
  password: string = '';

  hidePassword: boolean = true;

  constructor(private router: Router, private http: HttpClient) {
  }

  onSubmit() {
    console.log('Usuario:', this.username);
    console.log('Contraseña:', this.password);
    console.log('Gmail:', this.gmail);

    const datos = {
      email: this.gmail,
      password: this.password,
      username: this.username
    };

    this.http.post<any>('http://localhost:8080/api/users', datos).subscribe(
      response => {
        if (response) {
          console.log(response)
          alert("Registro realizado");
          // this.router.navigate(['/login']);
        }
      },
      error => {
        console.log(error)
        alert("Problema al registrar");
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
