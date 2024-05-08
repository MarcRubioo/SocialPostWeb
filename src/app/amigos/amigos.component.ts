import {Component, OnInit} from '@angular/core';
import {FriendsService} from "../friends.service";
import {user} from "@angular/fire/auth";

@Component({
  selector: 'app-amigos',
  templateUrl: './amigos.component.html',
  styleUrls: ['./amigos.component.css']
})
export class AmigosComponent implements OnInit {

  friends: any[] = [];

  constructor(private friendsService: FriendsService) {
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
        }
      );
  }

  deleteFriend(user: any) {
    this.friendsService.deleteFriend(user)
      .then(
        friendsList => {
          this.friends = friendsList;
          console.log("Friends at component ts: ", this.friends);
        },
        error => {
          console.error('Error deleting friends:', error);
        }
      )
  }

  protected readonly user = user;
}
