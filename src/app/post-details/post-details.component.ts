import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
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
    //TODO put user in a service then navigate to userDetails page
    this.userService.user = user;
    this.router.navigate(["/user-details"])
  }

  // async loadPostDetails(): Promise<void> {
  //   this.post = this.postService.post;
  //
  //   try {
  //     await this.postService.loadPostComments(this.post.email);
  //   } catch (error) {
  //     console.error('Error loading post comments:', error);
  //   }
  // }

  protected readonly localStorage = localStorage;
}
