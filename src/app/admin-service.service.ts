import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, map, Observable, of} from 'rxjs';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class AdminServiceService {

  public admin: boolean;
  public users: any[] = [];
  public categories: string[] = [];

  constructor(private http: HttpClient) {
    if (this.admin) {
      this.adminGetAllUsers();
      this.adminGetAllCategories();
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


  deleteCategory(category: string): Observable<string> {
    const token = localStorage.getItem('idToken');

    if (!token) {
      console.error('No se encontraron el token o el email en el almacenamiento local.');
      return of("");
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'idToken': token,
    });

    return this.http.delete<any>(`http://localhost:8080/api/admin/deleteCategory/${category}`, {
      headers: headers
    })
      .pipe(
        map(response => {
          if (response.responseNo == 200) {
            window.alert("Category eliminated correctly");
            return category;
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

  adminGetAllCategories(): Promise<any> {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('idToken');
      if (!token) {
        console.error('No se encontraron el token o el email en el almacenamiento local.');
        reject('No token found');
        return;
      }

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'idToken': token,
      });

      this.http.get<any>("http://localhost:8080/api/admin/getAllCategories", {headers: headers})
        .subscribe(response => {
          if (response && response.responseNo == 200) {
            console.log(response);
            console.log("gotten all categories correctly");
            resolve(response.data[0]);
          } else {
            reject('Failed to get categories');
          }
        }, error => {
          reject(error);
        });
    });
  }


  createCategory(category: string): Promise<any> {
    return new Promise((resolve, reject) => {
      const token = localStorage.getItem('idToken');
      if (!token) {
        console.error('No se encontraron el token o el email en el almacenamiento local.');
        reject('No token found');
      }

      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'idToken': token,
      });

      this.http.post<any>("http://localhost:8080/api/admin/insertCategory", category, {headers: headers})
        .subscribe(response => {
            if (response && response.responseNo == 200) {
              console.log(response);
              console.log("Category added correctly");
              this.categories = response.data[0];
              console.log("categories after insert | ", this.categories);
              resolve(this.categories);
            } else {
              console.error(response);
              reject('Failed to create category');
            }
          },
          error => {
            reject(error);
          })
    })
  }


  updateCategory(category: string, newValue: string) {
    const token = localStorage.getItem('idToken');
    if (!token) {
      console.error('No se encontraron el token o el email en el almacenamiento local.');
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'idToken': token,
    });

    console.log("Category | " + category + " | New Value | " + newValue);


    this.http.put<any>(`http://localhost:8080/api/admin/updateCategory/${category}`, newValue, {headers: headers})
      .subscribe(response => {
        if (response && response.responseNo == 200) {
          console.log(response);
          console.log("Category updated correctly");
          let categoryIndex = this.categories.indexOf(category);
          this.categories[categoryIndex] = newValue;
        } else {
          console.error(response);
        }
      })
  }


}
