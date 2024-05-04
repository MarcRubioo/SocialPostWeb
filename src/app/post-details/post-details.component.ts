import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {PostService} from "../post.service";
import {Router} from "@angular/router";
import {AdminServiceService} from "../admin-service.service";

@Component({
  selector: 'app-post-details',
  templateUrl: './post-details.component.html',
  styleUrls: ['./post-details.component.css']
})
export class PostDetailsComponent {

  post: any = this.postService.post;
  comments: any[] = [];
  admin: boolean = this.adminService.admin;

  constructor(private http: HttpClient, private postService: PostService,
              private router: Router, private adminService: AdminServiceService) {
    console.clear();
    console.log("Post received | ", this.post);

    this.comments = this.post.comments;
  }

  deleteComment(comment: any, post: any) {
    if (this.admin) {
      this.postService.deleteComment(comment, post)
        .subscribe();
    }
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

}
