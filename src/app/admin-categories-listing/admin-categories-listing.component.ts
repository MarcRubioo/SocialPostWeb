import {Component, OnInit} from '@angular/core';
import {AdminServiceService} from "../admin-service.service";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-admin-categories-listing',
  templateUrl: './admin-categories-listing.component.html',
  styleUrls: ['./admin-categories-listing.component.css']
})
export class AdminCategoriesListingComponent implements OnInit {

  admin: boolean = this.adminService.admin;
  categories: string[] = [];
  editedValues: { [key: string]: string } = {};

  newCategory: string;

  constructor(private adminService: AdminServiceService) {
  }

  ngOnInit(): void {
    if (this.admin) {
      this.getAllCategories();
    }
  }

  getAllCategories() {
    this.adminService.adminGetAllCategories().then(
      categories => {
        this.categories = categories;
        console.log("Categories at component ts: ", this.categories);
      },
      error => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  deleteCategory(category: string) {
    if (this.admin) {
      this.adminService.deleteCategory(category)
        .subscribe(categoryDeleted => {
          if (categoryDeleted == "") {
            console.error("category was empty!");
            return;
          }
          const index = this.categories.indexOf(category);
          if (index !== -1) {
            this.categories.splice(index, 1);
            console.log("Category was deleted from the array!");

            // Mostrar el popup de confirmación
            Swal.fire({
              icon: 'success',
              title: 'Se ha eliminado correctamente la categoría',
              text: category,
              confirmButtonText: 'Aceptar'
            });
          } else {
            console.log("Category not found in the array");
          }
        });
    }
  }


  createCategory(category: string) {
    if (this.admin) {

      if (/\d/.test(category)) {
        return;
      }
      this.adminService.createCategory(category)
        .then(categories => {
            this.categories = categories;
            console.log("Categories after creating at ts: ", this.categories);
          },
          error => {
            console.error('Error inserting category:', error);
          });
    }
  }

  middleGroundEditCategory(category: string) {
    this.updateCategory(category);
  }

  updateCategory(category: string) {
    const newValue = this.editedValues[category]; // Get the edited value for the category
    this.adminService.updateCategory(category, newValue);
    this.categories = this.adminService.categories;
  }
}
