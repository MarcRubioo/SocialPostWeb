import { Component } from '@angular/core';
import {AdminServiceService} from "../admin-service.service";

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

  admin: boolean = this.adminService.admin

  constructor(private adminService: AdminServiceService) {
  }

}

