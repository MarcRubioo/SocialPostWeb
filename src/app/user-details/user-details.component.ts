import {Component, OnInit} from '@angular/core';
import {AdminServiceService} from "../admin-service.service";
import {UserService} from "../user.service";
import {PostService} from "../post.service";
import {Router} from "@angular/router";

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
              private adminService: AdminServiceService, private router: Router) {

  }

  ngOnInit(): void {
    this.loadUserPosts();
    console.log("user | ", this.user);
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

  addFriend(user: any): void {
    this.userService.addFriendToUser(user)
      .then(
        currentUserFriendsList => {
          if (currentUserFriendsList.length <= 0) {
            console.error("something went wrong");
            return;
          } else if (currentUserFriendsList.some(friend => friend.email === user.email)) {
            console.log("Friend added successfully");
            window.alert("Friend added successfully");

          }
        }
      )
  }

  deleteFriend(user: any): void {
    this.userService.deleteFriend(user)
      .then(
        currentUserFriendsList => {
          if (currentUserFriendsList.length <= 0) {
            console.error("something went wrong");
            return;
          } else if (currentUserFriendsList.some(friend => friend.email === user.email)) {
            console.log("Friend deleted successfully");
            window.alert("Friend deleted successfully");
          }
        }
      )
  }

  checkIfFriend(email: string, user: any): boolean {
    return user.friends.some(friend => friend.email === email);
  }

  checkIfFollowing(email: string, user: any): boolean {
    return user.followers.some(following => following.email === email);
  }

  followUser(user: any): void {
    let email = localStorage.getItem('email');

    this.userService.followUser(user)
      .then(
        followersList => {
          if (followersList.length <= 0) {
            console.error("something went wrong");
            return;
          }
          this.user.followers = followersList[0];
          console.log(this.user.followers);
          if (this.user.followers.some(follower => follower.email === email)) {
            console.log("User followed successfully");
            window.alert("User followed successfully");
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
            console.error("something went wrong");
            return;
          }
          this.user.followers = followersList[0];
          if (!this.user.followers.some(follower => follower.email === email)) {
            console.log("User unfollowed successfully");
            window.alert("User unfollowed successfully");
          }
        }
      )
  }

  protected readonly localStorage = localStorage;
}
