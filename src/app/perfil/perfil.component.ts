import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import firebase from 'firebase/compat/app';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  userData: String = localStorage.getItem('email');
  postContent: string;
  userDetails: any;
  userPosts: any[];


  constructor(private http: HttpClient) {
    this.loadUserPosts()
  }

  ngOnInit() {
    this.getUserDetails();
    this.loadUserPosts();

  }



  parseDate(dateString: string): Date {
    const parsedDate = new Date(dateString);
    return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  }



  getUserDetails() {
    const email = localStorage.getItem('email');
    const idToken = localStorage.getItem('idToken');

    if (!email || !idToken) {
      console.error('No se encontró el email o el token en el almacenamiento local.');
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'idToken': idToken
    });

    this.http.get<any>('http://127.0.0.1:8080/api/user?email=' + email, { headers: headers })
      .subscribe(
        (response) => {
          this.userDetails = response.data[0];
          console.log('Detalles del usuario:', this.userDetails);
          // Aquí puedes asignar los detalles del usuario a las variables de tu componente y mostrarlas en tu página web
        },
        (error) => {
          console.error('Error al obtener los detalles del usuario:', error);
        }
      );
  }

  generateRandomId(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const idLength = 15;
    let randomId = '';

    for (let i = 0; i < idLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomId += characters.charAt(randomIndex);
    }

    return randomId;
  }

  submitPost() {
    if (!this.postContent) {
      return; // Evitar publicaciones vacías
    }

    const token = localStorage.getItem('idToken');
    const email = localStorage.getItem('email');

    if (!token || !email) {
      console.error('No se encontraron el token o el email en el almacenamiento local.');
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'idToken': token,
      'userEmail': email
    });

    const postData = {
      id: this.generateRandomId(),
      email: email,
      createdAT: new Date().toISOString(),
      description: this.postContent,
      images: [],
      category: [],
      likes: [],
      comments: [],
    };

    this.http.post<any>('http://127.0.0.1:8080/api/posts', postData, {headers: headers}).subscribe(
      response => {
        console.log('Publicación creada:', response);
        this.postContent = '';
      },
      error => {
        console.error('Error al crear la publicación:', error);
      }
    );
  }


  loadUserPosts() {

    const token = localStorage.getItem('idToken');
    const email = localStorage.getItem('email');

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'idToken': token,
    });

    this.http.get<any>('http://127.0.0.1:8080/api/userPosts?email=' + email, {headers: headers}).subscribe(
      response => {
        console.log('Conseguidoo posts de usuario:', response);
        this.userPosts = response.data;        //variable = response.data[0]
      },
      error => {
        console.error('Error al crear la publicación:', error);
      }
    );
  }
}
