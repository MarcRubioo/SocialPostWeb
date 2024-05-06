import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {AdminServiceService} from "./admin-service.service";
import {catchError, map, Observable, of} from "rxjs";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class PostService {

  post: any;
  comments: any[] = [];
  admin: boolean = this.adminService.admin;

  constructor(private http: HttpClient, private adminService: AdminServiceService,
              private router: Router) {
  }

  loadPostComments(email: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.comments = [];

      const token = localStorage.getItem('idToken');

      if (!token || !email) {
        console.error('No se encontraron el token o el email en el almacenamiento local.');
        reject('Token or email not found in local storage');
        return;
      }

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'idToken': token,
      });

      let params = new HttpParams();
      params = params.set("email", email);

      this.http.get<any>("http://localhost:8080/api/userPosts", {
        headers: headers,
        params: params
      }).subscribe(
        response => {
          if (response && response.responseNo == 200) {
            response.data.forEach((post: any) => {
              this.comments.push(post);
            })
            resolve(this.comments);
          } else {
            reject('Failed to load post comments');
          }
        },
        error => {
          reject(error);
        }
      )
    });
  }

  deleteComment(comment: any, post: any): Observable<any> {
    if (this.admin) {
      const token = localStorage.getItem('idToken');
      if (!token) {
        console.error('No se encontraron el token o el email en el almacenamiento local.');
        return of("");
      }

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'idToken': token,
      });

      return this.http.delete<any>(`http://localhost:8080/api/admin/deletePostComment/${post.id}/${comment.id}`, {headers: headers})
        .pipe(
          map(response => {
            if (response && response.responseNo == 200) {
              window.alert("Comment eliminated correctly");
              return comment.id;
            }
            return "";
          }),
          catchError(error => {
            console.error("Error | ", error);
            return of("");
          })
        )
    } else {
      return of("");
    }
  }


  getUserData(postEmail: string): Promise<any> {
    return new Promise((resolve, reject) => {
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

      let params = new HttpParams();
      params = params.set("email", postEmail);

      this.http.get<any>("http://localhost:8080/api/user", {
        headers: headers,
        params: params
      })
        .subscribe(
          response => {
            if (response && response.responseNo == 200) {
              console.log(response);
              console.log("gotten user data correctly");
              resolve(response.data[0]);
            }
          },
          error => {
            reject(error);
          }
        )
    });
  }

  addLikeToPost(post: any): Promise<any> {
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

      this.http.put<any>(`http://localhost:8080/api/addLikePost/${post.id}`, email, {
        headers: headers,
      }).subscribe(
        response => {
          if (response && response.responseNo == 200) {
            console.log(response);
            console.log("Added like to post!");
            resolve(response.data[0]);
          }
        }, error => {
          reject(error);
        }
      )
    })
  }

  deleteLikeToPost(post: any): Promise<any> {
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

      this.http.delete<any>(`http://localhost:8080/api/deleteLikePost/${post.id}`,{
        headers: headers,
        params: params
      }).subscribe(
        response => {
          if (response && response.responseNo == 200) {
            console.log(response);
            console.log("Deleted like to post!");
            resolve(response.data[0]);
          }
        }, error => {
          reject(error);
        }
      )
    })
  }

  addLikeToComment(post: any, comment: any): Promise<any> {
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

      this.http.put<any>(`http://localhost:8080/api/addLikePostComment/${post.id}/${comment.id}`, email, {
        headers: headers,
      }).subscribe(
        response => {
          if (response && response.responseNo == 200) {
            console.log(response);
            console.log("Deleted like to comment!");
            resolve(response.data[0]);
          }
        }, error => {
          reject(error);
        }
      )
    });
  }


  deleteLikeToComment(post: any, comment: any): Promise<any> {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('idToken');
      const email = localStorage.getItem('email');

      if (!token || !email) {
        console.error('No se encontró el email o el token en el almacenamiento local.');
        reject('No token found');
        return;
      }

      let headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'idToken': token
      });

      let params = new HttpParams();
      params = params.set("email", email);

      this.http.delete<any>(`http://localhost:8080/api/deleteLikePostComment/${post.id}/${comment.id}`,{
        headers: headers,
        params: params
      }).subscribe(
        response => {
          if (response && response.responseNo == 200) {
            console.log(response);
            console.log("Deleted like to comment!");
            resolve(response.data[0]);
          }
        }, error => {
          reject(error);
        }
      )
    });
  }
}
