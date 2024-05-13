import {Component, OnInit} from '@angular/core';
import {FriendsService} from "../friends.service";
import {user} from "@angular/fire/auth";
import {ToastService} from "../toast.service";

@Component({
  selector: 'app-amigos',
  templateUrl: './amigos.component.html',
  styleUrls: ['./amigos.component.css']
})
export class AmigosComponent implements OnInit {

  friends: any[] = [];

  constructor(private friendsService: FriendsService, private toastService: ToastService) {
  }

  ngOnInit(): void {
    this.getAllFriends();
  }


  getAllFriends() {
    this.friendsService.getAllFriends()
      .then(
        friendsList => {
          this.friends = friendsList;
          console.log("Friends at component ts: ", this.friends);
        },
        error => {
          console.error('Error getting friends:', error);
          this.toastService.pushInfo(error, "error-bc", "info");
        }
      );
  }

  deleteFriend(user: any) {
    this.friendsService.deleteFriend(user)
      .then(
        friendToDelete => {
          if (friendToDelete == null) {
            console.error("something went wrong");
          }
          console.log("userToDelete", friendToDelete);
          let deleteUserIndex = this.friends.indexOf(user);
          if (deleteUserIndex !== -1) {
            this.friends.splice(deleteUserIndex, 1);
          }
          console.log("List after deletion | ", this.friends);
          this.toastService.pushInfo("Friend deleted successfully!", "success-bc", "success");
        },
        error => {
          console.error('Error deleting friends:', error);
          this.toastService.pushInfo(error, "error-bc", "info");
        }
      )
  }

}
