// home.component.ts

import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {AdminServiceService} from "../admin-service.service";
import {PostService} from "../post.service";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import { CreatePostPopupComponent } from '../create-post-popup/create-post-popup.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  posts: any[] = [];
  postUserDetail: any[] = [];

  categories: string[] = [];
  selectedCategories: string[] = [];

  showCreatePostForm: boolean = false;
  selectedCategory: string = '';
  postContent: string = '';

  admin: boolean = this.adminService.admin


  constructor(private http: HttpClient, private adminService: AdminServiceService,
              private postService: PostService, private router: Router, public dialog: MatDialog) {
  }

  async ngOnInit(): Promise<void> {
    this.getCategories();
    document.getElementById('publicar')?.addEventListener('click', () => {
      this.submitPost();
    });

    await this.getAllPosts().then(sortedPosts => {
      const postEmails = sortedPosts.map(post => post.email);
      const uniquePostEmails = Array.from(new Set(postEmails)); // Get unique post emails

      const userDataPromises = uniquePostEmails.map(email => this.postService.getUserData(email));
      Promise.all(userDataPromises).then(users => {
        const userDataMap = new Map(users.map(user => [user.email, user])); // Map user data by email

        sortedPosts.forEach(post => {
          const user = userDataMap.get(post.email);
          if (user) {
            this.postUserDetail.push(user);
          }
        });

        console.log("post user details after loop | ", this.postUserDetail);
      }).catch(error => {
        console.log(error);
      });
    });
  }

  openCreatePostPopup(): void {
    const dialogRef = this.dialog.open(CreatePostPopupComponent, {
      width: '500px', // Ancho del popup
      // Otiones adicionales del popup
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('El popup ha sido cerrado.');
      // Aquí puedes realizar acciones después de que el popup ha sido cerrado, si es necesario
    });
  }


  toggleCreatePostForm(): void {
    this.showCreatePostForm = !this.showCreatePostForm;
  }

  parseDate(dateString: string): Date {
    const parsedDate = new Date(dateString);
    return isNaN(parsedDate.getTime()) ? new Date() : parsedDate;
  }

  isSelected(category: string): boolean {
    return this.selectedCategories.includes(category);
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

  // Función para enviar una nueva publicación al servidor
  submitPost() {
    if (!this.postContent) {
      return;
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

    let params = new HttpParams();
    params = params.set("category", this.selectedCategory);

    const postData = {
      id: this.generateRandomId(),
      email: email,
      createdAT: new Date().toISOString(),
      description: this.postContent,
      images: [],
      likes: [],
      comments: [],
    };

    this.http.post<any>('http://127.0.0.1:8080/api/posts', postData,
      {
        headers: headers,
        params: params
      }).subscribe(
      response => {
        console.log('Publicación creada:', response);
        this.postContent = '';
      },
      error => {
        console.error('Error al crear la publicación:', error);
      }
    );
  }

  // Función para obtener todos los posts desde el servidor
  async getAllPosts(): Promise<any[]> {
    const token = localStorage.getItem('idToken');
    if (!token) {
      console.error('No se encontró el token en el almacenamiento local.');
      return [];
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'idToken': token,
    });

    try {
      const response = await this.http.get<any>('http://127.0.0.1:8080/api/allposts', {headers: headers}).toPromise();
      const sortedPosts = response.data.filter(post => {
        return this.selectedCategories.every(category => post.categories.includes(category));
      }).map(post => ({
        ...post,
        createdAT: this.parseDate(post.createdAT)
      })).sort((a, b) => b.createdAT.getTime() - a.createdAT.getTime());
      this.posts = sortedPosts;

      sortedPosts.forEach((post, index) => {
        this.currentSlides[index] = 0;
      });

      console.log("SORTED LIST | ", sortedPosts);
      return sortedPosts;
    } catch (error) {
      console.error('Error al obtener los posts:', error);
      return [];
    }
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


  toggleCategory(category: string): void {
    if (this.selectedCategories.includes(category)) {
      this.selectedCategories = this.selectedCategories.filter(c => c !== category);
    } else {
      this.selectedCategories.push(category);
    }
    console.log('Categorías seleccionadas:', this.selectedCategories);
    this.getAllPosts(); // Llama a getAllPosts cada vez que cambia la selección de categorías
  }


  sendPost(post: any): void {
    const token = localStorage.getItem('idToken');

    if (!token) {
      console.error('No se encontró el token en el almacenamiento local.');
      return;
    }

    this.postService.post = post;

    this.router.navigate(["/post-details"])
  }


  deletePost(post: any): void {
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

  currentSlides: { [key: number]: number } = {};

  prevSlide(postIndex: number): void {
    const post = this.posts[postIndex];
    const totalSlides = post.images.length;
    if (this.currentSlides[postIndex] === 0) {
      this.currentSlides[postIndex] = totalSlides - 1;
    } else {
      this.currentSlides[postIndex]--;
    }
  }

  nextSlide(postIndex: number): void {
    const post = this.posts[postIndex];
    const totalSlides = post.images.length;
    if (this.currentSlides[postIndex] === totalSlides - 1) {
      this.currentSlides[postIndex] = 0;
    } else {
      this.currentSlides[postIndex]++;
    }
  }



}


