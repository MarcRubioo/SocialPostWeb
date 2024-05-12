// app.module.ts
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AngularFireModule} from '@angular/fire/compat';
import {AngularFireAuth, AngularFireAuthModule} from '@angular/fire/compat/auth'; // Importa AngularFireAuth
import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';
import {RegisterComponent} from './register/register.component';
import {HomeComponent} from './home/home.component';
import {AppRoutingModule} from './app-routing.module';
import {RouterOutlet} from "@angular/router";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {AmigosComponent} from './amigos/amigos.component';
import {PerfilComponent} from './perfil/perfil.component';
import {HttpClientModule} from '@angular/common/http';
import {enviroment} from '../environments/environment';
import {provideAuth, getAuth} from '@angular/fire/auth';
import {initializeApp, provideFirebaseApp} from '@angular/fire/app';
import {AdminLoginComponent} from './admin-login/admin-login.component';
import {AdminDashboardComponent} from './admin-dashboard/admin-dashboard.component';
import {AdminUsersListComponent} from './admin-users-list/admin-users-list.component';
import {PostDetailsComponent} from './post-details/post-details.component';
import {AdminCategoriesListingComponent} from './admin-categories-listing/admin-categories-listing.component';
import {NgOptimizedImage} from "@angular/common";
import {ChatComponent} from './chat/chat.component';
import {TranslateModule} from '@ngx-translate/core';
import {UserDetailsComponent} from './user-details/user-details.component';
import {MenuComponent} from './menu/menu.component';
import {ToastModule} from "primeng/toast";
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MessageService} from "primeng/api";
import {MatInputModule} from "@angular/material/input";
import {MatAutocompleteModule} from "@angular/material/autocomplete"



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    HomeComponent,
    AmigosComponent,
    PerfilComponent,
    AdminLoginComponent,
    AdminDashboardComponent,
    AdminUsersListComponent,
    PostDetailsComponent,
    AdminCategoriesListingComponent,
    UserDetailsComponent,
    MenuComponent,
    UserDetailsComponent,
    ChatComponent
  ],
  imports: [
    BrowserModule,
    AngularFireAuthModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    provideFirebaseApp(() => initializeApp(enviroment.firebase)),
    provideAuth(() => getAuth()),
    NgOptimizedImage,
    BrowserModule,
    TranslateModule.forRoot(),
    ToastModule,
    BrowserAnimationsModule,
    MatInputModule,
    MatAutocompleteModule,
    ReactiveFormsModule,
  ],
  providers: [AngularFireAuth, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
