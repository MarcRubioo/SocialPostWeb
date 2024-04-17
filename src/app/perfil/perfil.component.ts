import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  userData: any;

  constructor() {


  }
  ngOnInit(): void {
    // this.firebaseService.getUserData("1Nkd9yQLKQMcTCSs2k4j").subscribe((data: any) => {
    //   this.userData = data; // Almacena los datos del usuario en la variable
    // });
  }
}
