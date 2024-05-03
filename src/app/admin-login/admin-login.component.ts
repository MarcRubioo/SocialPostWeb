import {Component} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Auth, signInWithEmailAndPassword} from "@angular/fire/auth";
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin-login',
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  username: string = '';
  password: string = '';
  hidePassword: boolean = true;

  constructor(private http: HttpClient, private auth: Auth, private router: Router) {

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
        this.http.post<any>("http://localhost:8080/api/admin/login",
          {
            email: this.username,
            password: this.password,
            firstName: ""
          }, headers).subscribe(
          response => {
            if (response) {
              console.log("response: ", response);
              // Redirige al usuario a la página de inicio si el inicio de sesión es correcto
              if (response.responseNo == 200) {
                alert("Inicio de sesión correctamente realizado");
                this.router.navigate(['/home']);
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
