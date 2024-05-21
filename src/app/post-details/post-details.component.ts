import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {PostService} from "../post.service";
import {Router} from "@angular/router";
import {AdminServiceService} from "../admin-service.service";
import {UserService} from "../user.service";

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent implements OnInit {

  post: any = this.postService.post;
  comments: any[] = [];
  commentsDetails: any[] = [];
  user: any;
  admin: boolean = this.adminService.admin;
  currentIndex: number = 0; // For carousel

  constructor(private postService: PostService, private router: Router,
              private adminService: AdminServiceService, private userService: UserService,
  ) {
    console.log("Post received | ", this.post);

    this.comments = this.post.comments;
    console.log("comments, ", this.comments);
  }

  ngOnInit(): void {
    this.getUserInfo(this.post.email);
    this.comments.forEach((comment: any) => {
      this.postService.getUserData(comment.email)
        .then(
          user => {
            this.commentsDetails.push(user);
          }
        )
    });
  }

  getUserInfo(email: string): void {
    this.postService.getUserData(email)
      .then(
        user => {
          this.user = user;
          console.log("user data gotten correctly");
        },
        error => {
          console.log(error);
        }
      )
  }

  deleteComment(comment: any, post: any): void {
    if (this.admin) {
      this.postService.deleteComment(comment, post)
        .subscribe(idCommentDeleted => {
          if (idCommentDeleted == "") {
            console.error("comment id was empty!");
            return;
          }

          console.log("idComment | ", idCommentDeleted);
          const index = this.comments.findIndex(u => u.id === comment.id);
          if (index !== -1) {
            this.comments.splice(index, 1);
            console.log("Comment deleted from the array");
          } else {
            console.log("Comment not found in the array");
          }
        });
    }
  }

  deletePost(post: any): void {
    if (this.admin) {
      this.adminService.deletePost(post)
        .subscribe(idPostDeleted => {
          if (idPostDeleted == "") {
            console.error("post id was empty!");
            return;
          }
          console.log("idPost | ", idPostDeleted);
          this.router.navigate(["../home"]);
        });
    }
  }

  addLikeToPost(post: any): void {
    //PathVariables needed  idPost
    this.postService.addLikeToPost(post)
      .then(
        likesList => {
          this.post.likes = likesList;
          console.log("likes at the ts | ", this.post.likes);
        }, error => {
          console.error(error);
        }
      )
  }

  deleteLikeToPost(post: any): void {
    //PathVariables needed  idPost
    this.postService.deleteLikeToPost(post)
      .then(
        likesList => {
          this.post.likes = likesList;
          console.log("likes at the ts | ", this.post.likes);
        }, error => {
          console.error(error);
        }
      )
  }

  addLikeToComment(post: any, comment: any, position: number): void {
    //PathVariables needed  idPost | idComment
    this.postService.addLikeToComment(post, comment)
      .then(
        likesList => {
          this.comments[position].likes = likesList;
          console.log("likes at the ts | ", this.comments[position]);
        }, error => {
          console.error(error);
        }
      )
  }

  deleteLikeToComment(post: any, comment: any, position: number): void {
    //PathVariables needed  idPost | idComment
    this.postService.deleteLikeToComment(post, comment)
      .then(
        likesList => {
          this.comments[position].likes = likesList;
          console.log("likes at the ts | ", this.comments[position].likes);
        }, error => {
          console.error(error);
        }
      )
  }

  goToUserDetails(user: any): void {
    this.userService.user = user;
    this.router.navigate(["/user-details"])
  }

  showCommentPostForm: boolean = false;
  commentContent: string = '';

  toggleCreatePostForm(): void {
    this.showCommentPostForm = !this.showCommentPostForm;
  }

  submitComment() {
    if (!this.commentContent) {
      return;
    }
    const email = localStorage.getItem('email');

    if (!email) {
      console.error('submitComment no email.');
      return;
    }

    const commentData = {
      id: this.generateRandomId(),
      email: email,
      commentAt: new Date().toISOString(),
      comment: this.commentContent,
      likes: [],
    };

    this.postService.addComment(commentData, this.post.id)
      .then(
        commentToAdd => {
          this.post.comments.push(commentToAdd);
          this.comments.forEach((comment: any) => {
            this.postService.getUserData(comment.email)
              .then(
                user => {
                  this.commentsDetails.push(user);
                  this.showCommentPostForm = !this.showCommentPostForm;
                }
              )
          });
          console.log("Correctly added to array!");
        }, error => {
          console.error(error);
        }
      )
  }

  generateRandomId(): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const idLength = 15;
    let randomId = '';

    for (let i = 0; i < idLength; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      randomId += characters.charAt(randomIndex);
    }

    return randomId;
  }

  protected readonly localStorage = localStorage;

  prevImage(): void {
    this.currentIndex = (this.currentIndex > 0) ? this.currentIndex - 1 : this.post.images.length - 1;
  }

  nextImage(): void {
    this.currentIndex = (this.currentIndex < this.post.images.length - 1) ? this.currentIndex + 1 : 0;
  }
}
