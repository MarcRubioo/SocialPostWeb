import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { HttpClient } from "@angular/common/http";
import {FirebaseApp} from "@angular/fire/app";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    username: string = '';
    password: string = '';
    hidePassword: boolean = true;

    constructor(private router: Router, private http: HttpClient, private afAuth: AngularFireAuth) { }

    async onSubmit() {
        console.log('Usuario:', this.username);
        console.log('Contraseña:', this.password);

        try {
            // Inicia sesión con correo electrónico y contraseña usando AngularFireAuth
            const userCredential = await this.afAuth.signInWithEmailAndPassword(this.username, this.password);

            // Si el inicio de sesión es exitoso, obtén el token de autenticación
            if (userCredential && userCredential.user) {
                console.log('Inicio de sesión exitoso');
                const token = await userCredential.user.getIdToken();

                localStorage.setItem("idToken" , token)

                // Envía el token como una cadena de texto en el encabezado de la solicitud HTTP
                this.http.post("http://localhost:8080/api/users/login", {}, { headers: { "idToken": token } })
                    .subscribe(
                        response => {
                            console.log(response);
                            // Redirige al usuario a la página de inicio
                            this.router.navigate(['/home']);
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
