import {Component} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Auth, signInWithEmailAndPassword} from "@angular/fire/auth";
import {Router} from "@angular/router";
import {AdminServiceService} from "../admin-service.service";

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  username: string = '';
  password: string = '';
  hidePassword: boolean = true;

  constructor(private http: HttpClient, private auth: Auth,
              private router: Router, private adminService: AdminServiceService) {

  }

  async onSubmit() {
    console.log('Usuario:', this.username);
    console.log('Contraseña:', this.password);

    try {
      const userCredential = await signInWithEmailAndPassword(this.auth, this.username, this.password);

      if (userCredential && userCredential.user) {
        console.log('Inicio de sesión exitoso');
        const token = await userCredential.user.getIdToken();
        const email = userCredential.user.email;

        localStorage.setItem("idToken", token);
        localStorage.setItem("email", email);

        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          'idToken': token,
        });

        // Realiza la solicitud HTTP al servidor
        this.http.post<any>("http://localhost:8080/api/admin/login",
          {
            email: this.username,
            password: this.password,
            firstName: ""
          },
          {headers: headers}).subscribe(
          response => {
            if (response) {
              console.log("response: ", response);
              // Redirige al usuario a la página de inicio si el inicio de sesión es correcto
              if (response.responseNo == 200) {
                alert("Inicio de sesión correctamente realizado");
                this.adminService.admin = true;
                this.router.navigate(['/admin-dashboard']);
              }
            }
          },
          error => {
            console.error('Error al iniciar sesión:', error);
            alert("Problema al iniciar sesión. Verifique sus credenciales.");
          }
        );
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      alert("Problema al iniciar sesión. Verifique sus credenciales.");
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
