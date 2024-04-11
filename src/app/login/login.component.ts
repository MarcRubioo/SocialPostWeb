import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  hidePassword: boolean = true;

  constructor(private router: Router, private http: HttpClient) {

  }

  onSubmit() {
    console.log('Usuario:', this.email);
    console.log('Contraseña:', this.password);

    const datos = {
      email: this.email,
      password: this.password
    };

    const headers = {
      headers: new HttpHeaders({
        'Content-Type': "application/json"
      })
    }

    this.http.post<any>('http://localhost:8080/api/users/login', datos, headers).subscribe(
      response => {
        if (response) {
          console.log(response);

          if (response.responseNo != 200) {
            alert("ERROR LOGGING IN WTF");

          } else {
            alert("Login Successfully");
            this.router.navigate(['/home']);
          }
        }
      },
      error => {
        console.log(error);
        alert("Problema al registrar");
      },
      () => {
        console.log("End of login post");
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
