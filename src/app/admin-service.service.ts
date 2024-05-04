import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, map, Observable, of} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  public admin : boolean;

  constructor(private http: HttpClient) {

  }

  deletePost(post: any): Observable<string> {
    const token = localStorage.getItem('idToken');
    const email = localStorage.getItem('email');

    if (!token || !email) {
      console.error('No se encontraron el token o el email en el almacenamiento local.');
      return of("");
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'idToken': token,
    });

    return this.http.delete<any>(`http://localhost:8080/api/admin/deletePost/${post.id}`, {headers: headers})
      .pipe(
        map(response => {
          if (response.responseNo == 200) {
            window.alert("Post eliminated correctly");
            return post.id;
          }
          return "";
        }),
        catchError(error => {
          console.error("Error | ", error);
          return of("");
        })
      );
  }
}
