import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {MatDialogRef} from '@angular/material/dialog';
import { PostService } from '../post.service';


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
  newPostImages: any[] = [];


  constructor(
    private http: HttpClient,
    private postService: PostService,
    public dialogRef: MatDialogRef<CreatePostPopupComponent>
  ) { }

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
    });


    const postData = {
      id: this.generateRandomId(),
      email: email,
      createdAT: new Date().toISOString(),
      description: this.postContent,
    };

    let params = new HttpParams();
    params = params.set("category", this.selectedCategories.join(","));

    this.http.post<any>('http://127.0.0.1:8080/api/posts', {
        post: postData,
        postImages: this.newPostImages.map(image => Array.from(image)),
      },
      {
        headers: headers,
        params: params
      }).subscribe(
      response => {
        console.log('Publicación creada:', response);
        this.postContent = '';
        this.selectedCategories = [];
        this.dialogRef.close();
        location.reload();
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

    this.http.get<any>('http://127.0.0.1:8080/api/categories',
      {
        headers: headers
      })
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


  async onSelectFile(event): Promise<void> {
    const files: File[] = event.target.files;
    let finalBytes: any[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const byteArray = await this.readFile(file);
      finalBytes.push(byteArray);
    }

    if (finalBytes.length > 0) {
      this.newPostImages = finalBytes;
      console.log("array of arraybytes | ", this.newPostImages);
    }
  }

  readFile(file: File): Promise<Uint8Array> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        const base64String = reader.result as string;
        const base64Data = base64String.split(',')[1];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteNumbers[i] = byteCharacters.charCodeAt(i);
        }

        const byteArray = new Uint8Array(byteNumbers);
        resolve(byteArray);
      };

      reader.onerror = (error) => {
        reject(error);
      };

      reader.readAsDataURL(file);
    });
  }


  protected readonly event = event;
}
