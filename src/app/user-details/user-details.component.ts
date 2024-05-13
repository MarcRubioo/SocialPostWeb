import {Component, OnInit} from '@angular/core';
import {AdminServiceService} from "../admin-service.service";
import {UserService} from "../user.service";
import {PostService} from "../post.service";
import {Router} from "@angular/router";
import {ToastService} from "../toast.service";


@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.component.html',
  styleUrls: ['./user-details.component.css']
})

export class UserDetailsComponent implements OnInit {

  user: any = this.userService.user;
  posts: any[] = [];
  admin = this.adminService.admin;
  befriended: boolean = false;
  followed: boolean = false;

  constructor(private userService: UserService, private postService: PostService,
              private adminService: AdminServiceService, private router: Router,
              private toastService: ToastService) {

  }

  ngOnInit(): void {
    this.loadUserPosts();
    console.log("user | ", this.user);
    this.checkIfFriend(localStorage.getItem('email'), this.user);
    this.checkIfFollowing(localStorage.getItem('email'), this.user);
  }

  loadUserPosts(): void {
    this.userService.loadUserPosts(this.user.email)
      .then(
        userPostsList => {
          this.posts = userPostsList;
          console.log("user posts gotten correctly");
          console.log("userPostsList from promise | ", userPostsList);
        }, error => {
          this.toastService.pushInfo(error, "error-bc", "error");
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
          this.toastService.pushInfo("Liked!", "success-bc", "info");
        }, error => {
          this.toastService.pushInfo(error, "error-bc", "error");
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
          this.toastService.pushInfo("Unliked!", "success-bc", "info");
        }, error => {
          this.toastService.pushInfo(error, "error-bc", "error");
          console.error(error);
        }
      )
  }

  sendPost(post: any): void {
    const token = localStorage.getItem('idToken');

    if (!token) {
      console.error('No se encontró el token en el almacenamiento local.');
      return;
    }

    this.postService.post = post;

    this.router.navigate(["/post-details"])
  }

  deletePost(post: any): void {
    if (this.admin) {
      this.adminService.deletePost(post)
        .subscribe(idPostDeleted => {
          if (idPostDeleted == "") {
            this.toastService.pushInfo("Error deleting post!", "error-bc", "error");
            console.error("post id was empty!");
            return;
          }
          let deletedPostIndex = this.posts.findIndex(p => p.id === post.id)
          if (deletedPostIndex !== -1) {
            this.posts.splice(deletedPostIndex, 1);
            console.log("Post deleted from the array");
            this.toastService.pushInfo("Post deleted successfully!", "success-bc", "info");
          } else {
            console.log("Post not found in the array");
          }
        });
    }
  }

  addFriend(user: any): void {
    this.userService.addFriendToUser(user)
      .then(
        userToAdd => {
          console.log(userToAdd);
          if (userToAdd == null) {
            this.toastService.pushInfo("Could not add friend!", "error-bc", "error");
            console.error("something went wrong");
            return;
          } else {
            console.log("Friend added successfully");
            this.user.friends.push(userToAdd);
            this.befriended = true;
            this.toastService.pushInfo("Friend added successfully", "success-bc", "success");
          }
        }
      )
  }

  deleteFriend(user: any): void {
    this.userService.deleteFriend(user)
      .then(
        userToDelete => {
          if (userToDelete == null) {
            this.toastService.pushInfo("Could not delete friend!", "error-bc", "error");
            console.error("something went wrong");
            return;
          }
          let deleteUserIndex = this.user.friends.findIndex(user => user.email == userToDelete.email)
          if (deleteUserIndex !== -1) {
            console.log("Friend deleted successfully");
            this.user.friends.splice(deleteUserIndex, 1);
            this.befriended = false;
            this.toastService.pushInfo("Friend deleted successfully", "success-bc", "success");
          }
        }
      )
  }

  checkIfFriend(email: string, user: any): void {
    this.befriended = false;
    this.befriended = user.friends.some(friend => friend.email === email);
  }

  checkIfFollowing(email: string, user: any): void {
    this.followed = false;

    this.followed = user.followers.some(following => following.email === email);
  }

  followUser(user: any): void {
    let email = localStorage.getItem('email');

    this.userService.followUser(user)
      .then(
        followersList => {
          if (followersList.length <= 0) {
            this.toastService.pushInfo("Error following user", "error-bc", "error");
            console.error("something went wrong");
            return;
          }
          this.user.followers = followersList[0];
          console.log(this.user.followers);
          if (this.user.followers.some(follower => follower.email === email)) {
            console.log("User followed successfully");
            this.followed = true;
            this.toastService.pushInfo("User followed successfully!", "success-bc", "success");
          }
        }
      )
  }

  unfollowUser(user: any): void {
    let email = localStorage.getItem('email');

    this.userService.unfollowUser(user)
      .then(
        followersList => {
          if (followersList.length <= 0) {
            this.toastService.pushInfo("Error unfollowing user", "error-bc", "error");
            console.error("something went wrong");
            return;
          }
          this.user.followers = followersList[0];
          if (!this.user.followers.some(follower => follower.email === email)) {
            console.log("User unfollowed successfully");
            this.followed = false
            this.toastService.pushInfo("User followed successfully", "success-bc", "success");
          }
        }
      )
  }

  protected readonly localStorage = localStorage;
}
