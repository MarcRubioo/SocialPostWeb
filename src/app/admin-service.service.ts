import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, map, Observable, of} from 'rxjs';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  public admin : boolean;
  public users: any[] = [];

  constructor(private http: HttpClient) {
    if (this.admin) {
      this.adminGetAllUsers();
    }
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


  deleteUser(user: any): Observable<string> {
    console.log("user at adminService | ", user);

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

    return this.http.delete<any>(`http://localhost:8080/api/admin/deleteUser/${user.id}`, {
      headers: headers
    })
      .pipe(
        map(response => {
          if (response.responseNo == 200) {
            window.alert("User eliminated correctly");
            return user.id;
          }
          return "";
        }),
        catchError(error => {
          console.error("Error | ", error);
          return of("");
        })
      );
  }


  adminGetAllUsers() {
    this.users = [];
    const token = localStorage.getItem('idToken');
    if (!token) {
      console.error('No se encontraron el token o el email en el almacenamiento local.');
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'idToken': token,
    });

    this.http.get<any>("http://localhost:8080/api/admin/getUsers", {headers: headers}).subscribe(
      response => {
        if (response.data) {
          console.log(response);
          response.data.forEach((user) => {
            this.users.push(user);
          })
          console.log(this.users);
          console.log("gotten all users correctly");
        }
      }
    )
  }
}
