import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-create-post-popup',
  templateUrl: './create-post-popup.component.html',
  styleUrls: ['./create-post-popup.component.css']
})
export class CreatePostPopupComponent implements OnInit {
  postContent: string = '';
  selectedCategories: string[] = [];
  categories: string[] = [];
  showCategories: boolean = false;


  constructor(private http: HttpClient, public dialogRef: MatDialogRef<CreatePostPopupComponent>) { }

  ngOnInit(): void {
    this.getCategories();
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

  submitPost(): void {
    if (!this.postContent || this.selectedCategories.length === 0) {
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

    const postData = {
      id: this.generateRandomId(),
      email: email,
      createdAT: new Date().toISOString(),
      description: this.postContent,
      images: [],
      likes: [],
      comments: [],
    };

    this.http.post<any>('http://127.0.0.1:8080/api/posts?category=' + this.selectedCategories.join(','), postData, { headers: headers }).subscribe(
        response => {
          console.log('Publicación creada:', response);
          this.postContent = '';
          this.selectedCategories = []; // Limpiar las categorías seleccionadas después de enviar el post
          this.dialogRef.close();
          location.reload(); // Recargar la página después de enviar el post
        },
        error => {
          console.error('Error al crear la publicación:', error);
        }
    );
  }

  getCategories(): void {
    const token = localStorage.getItem('idToken');

    if (!token) {
      console.error('No se encontró el token en el almacenamiento local.');
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'idToken': token,
    });

    this.http.get<any>('http://127.0.0.1:8080/api/categories', { headers: headers })
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
  }

  isSelected(category: string): boolean {
    return this.selectedCategories.includes(category);
  }



}
