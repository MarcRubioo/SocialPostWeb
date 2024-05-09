import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {HomeComponent} from "./home/home.component";
import {LoginComponent} from "./login/login.component";
import {RegisterComponent} from "./register/register.component";
import {RouterModule, Routes} from "@angular/router";
import {AmigosComponent} from "./amigos/amigos.component";
import {PerfilComponent} from "./perfil/perfil.component";
import {AdminLoginComponent} from "./admin-login/admin-login.component";
import {AdminDashboardComponent} from "./admin-dashboard/admin-dashboard.component";
import {AdminUsersListComponent} from "./admin-users-list/admin-users-list.component";
import {PostDetailsComponent} from "./post-details/post-details.component";
import {AdminCategoriesListingComponent} from "./admin-categories-listing/admin-categories-listing.component";
import {UserDetailsComponent} from "./user-details/user-details.component";

const routes: Routes = [
  {path: '', component: LoginComponent},
  {path: 'home' , component:HomeComponent},
  {path: 'login' , component:LoginComponent},
  {path: 'register' , component:RegisterComponent},
  {path: 'amigos' , component:AmigosComponent},
  {path: 'perfil' , component:PerfilComponent},
  {path: 'admin-login', component:AdminLoginComponent},
  {path: 'admin-dashboard', component:AdminDashboardComponent},
  {path: 'admin-userListing', component:AdminUsersListComponent},
  {path: 'post-details', component: PostDetailsComponent},
  {path: 'admin-categoriesListing', component: AdminCategoriesListingComponent},
  {path: 'user-details', component: UserDetailsComponent},
 


]

@NgModule({
  declarations: [],
  imports: [CommonModule, RouterModule.forRoot(routes)  ],
  exports:[RouterModule]
})
export class AppRoutingModule { }
