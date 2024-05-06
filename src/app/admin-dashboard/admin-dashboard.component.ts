import { Component } from '@angular/core';
import {Router} from "@angular/router";
import {AdminServiceService} from "../admin-service.service";

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent {

  admin = this.adminService.admin;

  constructor(private router: Router, private adminService: AdminServiceService) {
  }

  goToDeletePosts() {
    if (this.admin) {
      this.router.navigate(["/home"])
    }
  }

  goToUserListings() {
    if (this.admin) {
      this.router.navigate(["/admin-userListing"]);
    }
  }

  goToCategoriesListing() {
    if (this.admin) {
      this.router.navigate(["/admin-categoriesListing"])
    }
  }
}
