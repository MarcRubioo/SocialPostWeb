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

      const params = new HttpParams().set("email", email);

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


}
