import {Component, OnInit} from '@angular/core';
import {AdminServiceService} from "../admin-service.service";
import {UserService} from "../user.service";
import {PostService} from "../post.service";

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})
export class UserDetailsComponent implements OnInit {

  user: any = this.userService.user;
  posts: any[] = [];
  admin = this.adminService.admin;

  constructor(private userService: UserService, private postService: PostService,
              private adminService: AdminServiceService) {

  }

  ngOnInit(): void {
    this.loadUserPosts();
  }

  loadUserPosts(): void {
    this.userService.loadUserPosts(this.user.email)
      .then(
        userPostsList => {
          this.posts = userPostsList;
          console.log("user posts gotten correctly");
          console.log("userPostsList from promise | ", userPostsList);
        }, error => {
          console.error(error);
        }
      )
  }

  addLikeToPost(post: any, position: number): void {
    //PathVariables needed  idPost
    this.postService.addLikeToPost(post)
      .then(
        likesList => {
          this.posts[position].likes = likesList;
          console.log("likes at the ts | ", this.posts[position].likes);
        }, error => {
          console.error(error);
        }
      )
  }

  deleteLikeToPost(post: any, position: number): void {
    //PathVariables needed  idPost
    this.postService.deleteLikeToPost(post)
      .then(
        likesList => {
          this.posts[position].likes = likesList;
          console.log("likes at the ts | ", this.posts[position].likes);
        }, error => {
          console.error(error);
        }
      )
  }

  deletePost(post: any): void {
    if (this.admin) {
      this.adminService.deletePost(post)
        .subscribe(idPostDeleted => {
          if (idPostDeleted == "") {
            console.error("post id was empty!");
            return;
          }
          let deletedPostIndex = this.posts.findIndex(p => p.id === post.id)
          if (deletedPostIndex !== -1) {
            this.posts.splice(deletedPostIndex, 1);
            console.log("Post deleted from the array");
          } else {
            console.log("Post not found in the array");
          }
          console.log("idPost | ", idPostDeleted);
        });
    }
  }

  protected readonly localStorage = localStorage;
}
