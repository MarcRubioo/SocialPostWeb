// app.module.ts
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from '@angular/fire/compat';
import {AngularFireAuth, AngularFireAuthModule} from '@angular/fire/compat/auth'; // Importa AngularFireAuth
import { environment } from '../environments/environment';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home/home.component';
import { AppRoutingModule } from './app-routing.module';
import { RouterOutlet } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { AmigosComponent } from './amigos/amigos.component';
import { PerfilComponent } from './perfil/perfil.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        HomeComponent,
        AmigosComponent,
        PerfilComponent
    ],
    imports: [
        BrowserModule,
        AngularFireModule.initializeApp(environment.firebaseConfig), // Inicializa Firebase con la configuración de environment
        AngularFireAuthModule,
        AppRoutingModule,
        FormsModule,
        HttpClientModule
    ],
    providers: [AngularFireAuth], // Agrega AngularFireAuth a los providers
    bootstrap: [AppComponent]
})
export class AppModule { }
