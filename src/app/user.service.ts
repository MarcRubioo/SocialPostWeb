import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserService {

  public user: any;
  public userPosts: any[] = [];


  constructor(private http: HttpClient) {

  }

  loadUserPosts(email: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('idToken');

      if (!token) {
        console.error('No se encontró el email o el token en el almacenamiento local.');
        reject('No token found');
        return;
      }

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'idToken': token
      });

      let params = new HttpParams();
      params = params.set("email", email);

      this.http.get<any>(`http://localhost:8080/api/userPosts`, {
        headers: headers,
        params: params
      }).subscribe(
        response => {
          if (response && response.responseNo == 200) {
            console.log(response);
            console.log("gotten user posts correctly");
            resolve(response.data);
          }
        }, error => {
          reject(error);
        }
      )
    });
  }
}
