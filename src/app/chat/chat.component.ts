import {Component, OnInit} from '@angular/core';
import {PostService} from "../post.service";
import {UserService} from "../user.service";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  user: any;
  friendsToChat: any[] = [];
  messages: any[] = [];

  constructor(
    private postService: PostService,
    private userService: UserService,
  ) {
  }

  async ngOnInit() {
    await this.loadUserData();
    this.friendsToChat = this.user.friends;
  }

  async loadUserData(): Promise<void> {
    let email = localStorage.getItem('email');
    await this.postService.getUserData(email)
      .then(
        user => {
          if (user) {
            this.user = user;
          }
        }
      ).catch(error => {
        console.error(error);
      })
  }

  async loadMessages(chatId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      //TODO install socket.io-client and getChats
    });
  }


  async checkIfChatRoomExists(friend: any): Promise<any> {
    //TODO create Chat Object and pass it through webSocket
  }

}
