import {Component} from '@angular/core';
import {Router} from "@angular/router";
import {HttpClient, HttpHeaders} from "@angular/common/http";
// import { environment } from '../../environments/environment';
// import { provideAuth,getAuth } from '@angular/fire/auth';
// import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
// import { signInWithEmailAndPassword } from "@angular/fire/auth";
import {
  Auth,
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendEmailVerification,
  User
} from '@angular/fire/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  hidePassword: boolean = true;

  // app = initializeApp();
  // db = getFirestore(this.app);


  constructor(private router: Router, private http: HttpClient, private auth: Auth) {
  }

  async onSubmit() {
    console.log('Usuario:', this.username);
    console.log('Contraseña:', this.password);

    try {
      // Inicia sesión con correo electrónico y contraseña usando AngularFireAuth
      const userCredential = await signInWithEmailAndPassword(this.auth, this.username, this.password);

      console.log(userCredential);
      // Si el inicio de sesión es exitoso, obtén el token de autenticación
      if (userCredential && userCredential.user) {
        console.log('Inicio de sesión exitoso');
        const token = await userCredential.user.getIdToken();

        localStorage.setItem("idToken", token);

        const headers = {
          headers: new HttpHeaders({
            'Content-Type': "application/json",
            "idToken": token,
          })
        }

        // Envía el token como una cadena de texto en el encabezado de la solicitud HTTP
        this.http.post<any>("http://localhost:8080/api/users/login", {}, headers).subscribe(
            response => {
              if (response) {
                console.log("response: ", response);
                // Redirige al usuario a la página de inicio
                if (response.responseNo == 200) {
                  alert("Login correctly done");
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
