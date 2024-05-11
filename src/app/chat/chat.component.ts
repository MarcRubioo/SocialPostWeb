import {Component, OnInit} from '@angular/core';
import {PostService} from "../post.service";
import {UserService} from "../user.service";
import * as sockets from "socket.io-client";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  socket: any;

  user: any;
  userChats: any[] = [];
  messages: any[] = [];
  currentChat: any;

  constructor(
    private postService: PostService,
    private userService: UserService,
  ) {
  }

  async ngOnInit() {
    await this.loadUserData();

    this.socket = sockets.io('http://localhost:8080', { transports: ['websocket'] });
    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    //Emit to get the userChats
    this.socket.emit("/chat/myChatsToServer", { email: this.user.email });

    this.socket.on('/chat/myChatsToClient', (response: any) => {
      if (response && response.responseNo == 200) {
        this.userChats = []
        console.log(response);
        this.userChats = response.data;
      }
    });


    //Response after loading chat messages
    this.socket.on(`/chat/${this.currentChat.id}/getMessagesResponseToClient`, (response) => {
      if (response && response.responseNo == 200) {
        this.messages = [];

        console.log(response);
        this.messages = response.data;
      }
    });


    //Response after clicking user and calling checkIfChatRoomExists
    this.socket.on('/chat/checkChatRoomResponseToClient', (response: any) => {
      if (response && response.responseNo == 200) {
        console.log(response);
        this.currentChat = response.data[0];
      }
    });


    //Response after sending the message
    this.socket.on(`/chat/${this.currentChat.id}/sendResponseToClient`, (response) => {
      if (response && response.responseNo == 200) {
        console.log(response);
        this.messages = response.data;
      }
    })

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

  loadMessages(): void {
    this.socket.emit(`/chat/${this.currentChat.id}/getMessagesToServer`);
  }


  checkIfChatRoomExists(friend: any): void {
    let chat = {
      id: this.postService.generateRandomId(),
      users: [this.user, friend],
      userIds: [this.user.id, friend.id],
      lastMessage: "",
      lastMessageDate: ""
    }

    this.socket.emit("/chat/checkChatRoomToServer", { chat: chat });

    this.loadMessages();
  }


  sendMessage(text: string): void {
    let message = {
      senderId: this.user.id,
      senderDate: new Date().toISOString(),
      message: text
    }

    this.socket.emit(`/chat/${this.currentChat.id}/sendToServer`, { message: message });
  }

}
