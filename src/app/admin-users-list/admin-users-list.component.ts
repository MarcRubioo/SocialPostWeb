import { Component } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { AdminServiceService } from "../admin-service.service";
import { Router } from "@angular/router";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-users-list',
  templateUrl: './admin-users-list.component.html',
  styleUrls: ['./admin-users-list.component.css']
})
export class AdminUsersListComponent {

  users: any[] = [];
  admin: boolean = this.adminService.admin;

  constructor(private http: HttpClient, private adminService: AdminServiceService, private router: Router) {
    if (this.admin) {
      this.getAllUsers();
    }
  }

  getAllUsers() {
    this.users = [];
    this.adminService.adminGetAllUsers();
    this.users = this.adminService.users;
  }

  deleteUser(user: any) {
    if (this.admin) {
      console.log("user at usersList | ", user);
      this.adminService.deleteUser(user)
        .subscribe(idUserDeleted => {
          if (idUserDeleted == "") {
            console.error("user id was empty!");
            return;
          }
          console.log("idUser | ", idUserDeleted);
          const index = this.users.findIndex(u => u.id === idUserDeleted);
          if (index !== -1) {
            this.users.splice(index, 1);
            console.log("User deleted from the array");

            Swal.fire({
              icon: 'success',
              title: 'Se ha eliminado correctamente el usuario',
              text: `Usuario: ${user.firstName} - Email: ${user.email}`,
              confirmButtonText: 'Aceptar',
              customClass: {
                confirmButton: 'swal-confirm-button'
              }
            });
          } else {
            console.log("User not found in the array");
          }
        });
    }
  }

}
