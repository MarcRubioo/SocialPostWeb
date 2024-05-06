import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class FriendsService {

  constructor(private http: HttpClient) {

  }

  getAllFriends(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const token = localStorage.getItem('idToken');
      const email = localStorage.getItem('email');

      if (!email || !token) {
        console.error('No se encontró el email o el token en el almacenamiento local.');
        reject('No token found');
        return;
      }

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'idToken': token
      });


      this.http.get<any>("http://localhost:8080/api/user/friends", {headers: headers})
        .subscribe(
          response => {
            if (response && response.responseNo == 200) {
              console.log(response);
              console.log("gotten all friends correctly");
              resolve(response.data[0].friends);
            } else {
              reject("Failed to get friends from server");
            }
          },
          error => {
            reject(error);
          }
        )
    });
  }


  deleteFriend(user: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      const token = localStorage.getItem('idToken');
      const email = localStorage.getItem('email');

      if (!email || !token) {
        console.error('No se encontró el email o el token en el almacenamiento local.');
        reject('No token found');
        return;
      }

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'idToken': token
      });

      const params = new HttpParams();
      params.set("email", email);
      params.set("friendEmail", user.email);

      this.http.get<any>("http://localhost:8080/api/user/friends", {
        headers: headers,
        params: params
      }).subscribe(
        response => {
          if (response && response.responseNo == 200) {
            console.log(response);
            console.log("deleted friend successfully");
            resolve(response.data[0]);
          }
        },
        error => {
          reject(error);
        }
      )
    })
  }


  addFriend(user: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('idToken');
      const email = localStorage.getItem("email");

      if (!email || !token) {
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

      this.http.post<any>("http://localhost:8080/api/user/friends", user, {
        headers: headers,
        params: params
      }).subscribe(
        response => {
          if (response && response.responseNo == 200) {
            console.log(response);
            console.log("friend added successfully");
            resolve(response.data[0]);
          }
        }, error => {
          reject(error);
        }
      )
    });
  }
}
