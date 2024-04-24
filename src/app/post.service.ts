import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  constructor(private http: HttpClient) {}

  createPost(content: string) {
    return this.http.post<any>('http://tu-backend.com/api/posts', { content: content });
  }

  getPosts() {
    return this.http.get<any>('http://tu-backend.com/api/posts');
  }
}
