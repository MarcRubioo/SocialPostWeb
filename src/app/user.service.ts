import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";

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
            this.userPosts = response.data;
          }
        }, error => {
          reject(error);
        }
      )
    });
  }

  addFriendToUser(user: any): Promise<any> {
    return new Promise((resolve, reject) => {
      //Need ls email, ls token, user
      const token = localStorage.getItem('idToken');
      const email = localStorage.getItem('email');

      if (!token || !email) {
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

      this.http.post<any>('http://localhost:8080/api/user/friends', user, {
        headers: headers,
        params: params
      }).subscribe(
        response => {
          if (response && response.responseNo == 200) {
            console.log(response);
            console.log("Friend added successfully!");
            resolve(response.data[0]);
          }
        }, error => {
          reject(error);
        }
      )
    });
  }

  deleteFriend(user: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('idToken');
      const email = localStorage.getItem('email');

      if (!token || !email) {
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
      params = params.set("friendEmail", user.email);

      console.log("params | ", params);

      this.http.delete<any>('http://localhost:8080/api/user/friends', {
        headers: headers,
        params: params
      }).subscribe(
        response => {
          if (response && response.responseNo == 200) {
            console.log(response);
            console.log("Friend deleted successfully!");
            resolve(response.data[0]);
          }
        }, error => {
          reject(error);
        }
      );
    });
  }


  followUser(user: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('idToken');
      const email = localStorage.getItem('email');

      if (!token || !email) {
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

      this.http.post<any>("http://localhost:8080/api/user/follow", user, {
        headers: headers,
        params: params
      }).subscribe(
        response => {
          if (response && response.responseNo == 200) {
            console.log(response);
            console.log("User followed successfully!");
            resolve(response.data);
          }
        }, error => {
          reject(error);
        }
      )
    });
  }

  unfollowUser(user: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('idToken');
      const email = localStorage.getItem('email');

      if (!token || !email) {
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
      params = params.set("userEmail", user.email);

      this.http.delete<any>("http://localhost:8080/api/user/follow", {
        headers: headers,
        params: params
      }).subscribe(
        response => {
          if (response && response.responseNo == 200) {
            console.log(response);
            console.log("User unfollowed successfully!");
            resolve(response.data);
          }
        }, error => {
          reject(error);
        }
      )
    });
  }


  loadChatUserJWT(userId: string): Promise<any> {
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
      params = params.set("user_id", userId);

      this.http.get<any>("http://localhost:8080/api/user/loadChatUserJWT", {
        headers: headers,
        params: params
      })
        .subscribe(
          response => {
            if (response && response.responseNo == 200) {
              console.log(response);
              console.log("Gotten jwt correctly");
              resolve(response.data[0]);
            }
          }, error => {
            reject(error);
          }
        );
    });
  }
}
