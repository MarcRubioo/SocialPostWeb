// home.component.ts

import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {AdminServiceService} from "../admin-service.service";
import {PostService} from "../post.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  posts: any[] = [];
  categories: string[] = [];
  selectedCategories: string[] = [];
  admin: boolean = this.adminService.admin


  constructor(private http: HttpClient, private adminService: AdminServiceService,
              private postService: PostService, private router: Router) {
  }

  ngOnInit(): void {
    this.getCategories();
    document.getElementById('publicar')?.addEventListener('click', () => {
      this.submitPost();

    });

    // Carga los posts al iniciar el componente
    this.getAllPosts();
  }

  // Función para convertir una cadena de fecha en un objeto Date
  parseDate(dateString: string): Date {
    const parsedDate = new Date(dateString);
    return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  }

  // Función para enviar una nueva publicación al servidor
  submitPost() {
    const textoInput = document.getElementById('texto') as HTMLTextAreaElement;
    const fotoInput = document.getElementById('foto') as HTMLInputElement;

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
      description: textoInput.value,
      // Add other properties as needed
    };

    this.http.post<any>('http://127.0.0.1:8080/api/posts', postData, {headers: headers}).subscribe(
      response => {
        console.log('Publicación creada:', response);
        this.getAllPosts(); // Recarga los posts después de publicar uno nuevo
        textoInput.value = ''; // Limpia el campo de texto
        fotoInput.value = ''; // Limpia el campo de foto (si es necesario)
      },
      error => {
        console.error('Error al crear la publicación:', error);
      }
    );
  }

  // Función para obtener todos los posts desde el servidor
  getAllPosts() {
    const token = localStorage.getItem('idToken');
    if (!token) {
      console.error('No se encontró el token en el almacenamiento local.');
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'idToken': token,
    });

    this.http.get<any>('http://127.0.0.1:8080/api/allposts', {headers: headers})
      .subscribe(
        (response) => {
          this.posts = response.data.filter(post => {
            return this.selectedCategories.every(category => post.categories.includes(category));
          }).map(post => ({
            ...post,
            createdAT: this.parseDate(post.createdAT)
          }));
        },
        (error) => {
          console.error('Error al obtener los posts:', error);
        }
      );
  }


  getCategories() {
    const token = localStorage.getItem('idToken');

    if (!token) {
      console.error('No se encontró el token en el almacenamiento local.');
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'idToken': token,
    });

    this.http.get<any>('http://127.0.0.1:8080/api/categories', {headers: headers})
      .subscribe(
        (response) => {
          this.categories = response.data;
        },
        (error) => {
          console.error('Error al obtener las categorías:', error);
        }
      );
  }


  toggleCategory(category: string) {
    if (this.selectedCategories.includes(category)) {
      this.selectedCategories = this.selectedCategories.filter(c => c !== category);
    } else {
      this.selectedCategories.push(category);
    }
    console.log('Categorías seleccionadas:', this.selectedCategories);
    this.getAllPosts(); // Llama a getAllPosts cada vez que cambia la selección de categorías
  }


  sendPost(post: any) {
    const token = localStorage.getItem('idToken');

    if (!token) {
      console.error('No se encontró el token en el almacenamiento local.');
      return;
    }

    this.postService.post = post;

    this.router.navigate(["/post-details"])
  }



  deletePost(post: any) {
    if (this.admin) {
      this.adminService.deletePost(post)
        .subscribe(idPostDeleted => {
          if (idPostDeleted == "") {
            console.error("post id was empty!");
            return;
          }
          console.log("idPost | ", idPostDeleted);
          const index = this.posts.findIndex(p => p.id === idPostDeleted);
          if (index !== -1) {
            this.posts.splice(index, 1);
            console.log("Post deleted from the array");
          } else {
            console.log("Post not found in the array");
          }
        });
    }
  }

  addLikeToPost(post: any, position: number): void {
    //PathVariables needed  idPost
    this.postService.addLikeToPost(post)
      .then(
        likesList => {
          this.posts[position].likes = likesList;
          console.log("likes at the ts | ", this.posts[position].likes);
        }, error => {
          console.error(error);
        }
      )
  }

  deleteLikeToPost(post: any, position: number): void {
    //PathVariables needed  idPost
    this.postService.deleteLikeToPost(post)
      .then(
        likesList => {
          this.posts[position].likes = likesList;
          console.log("likes at the ts | ", this.posts[position].likes);
        }, error => {
          console.error(error);
        }
      )
  }

  protected readonly localStorage = localStorage;
}


