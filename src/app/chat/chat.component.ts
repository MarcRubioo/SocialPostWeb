import { Component, OnInit } from '@angular/core';
import { PostService } from "../post.service";
import { UserService } from "../user.service";
import { FormControl } from "@angular/forms";
import * as SockJS from "sockjs-client";
import { Client, Frame, IMessage } from "@stomp/stompjs";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  socket: any;
  stompClient: Client;
  searchFormControl = new FormControl();

  user: any;
  userChats: any[] = [];
  messages: any[] = [];
  currentMessage: string = "";
  currentChat: any;

  filteredFriends: any[] = [];

  constructor(
    private postService: PostService,
    private userService: UserService,
  ) {
  }

  filterFriends(): void {
    const value = this.searchFormControl.value.toLowerCase();
    this.filteredFriends = this.user.friends.filter(friend => friend.firstName.toLowerCase().includes(value));
  }

  ngOnInit(): void {
    this.initConnectionSocket();
  }

  initConnectionSocket(): void {
    const url = "//localhost:8080/chat-socket"; // Replace with your server URL
    this.socket = new SockJS(url);
    this.stompClient = new Client();
    this.stompClient.webSocketFactory = () => this.socket;

    this.stompClient.onConnect = (frame: Frame) => {
      console.log('Connected to WebSocket server');
      // Subscribe to channels and set up other listeners
      this.subscribeMainChannel();
      // Activate the STOMP client after setting up the connection
      this.stompClient.activate();
    };

    this.stompClient.onWebSocketError = (error: Frame) => {
      console.error('WebSocket error:', error);
    };

    this.stompClient.activate();

    this.loadUserData();

  }

  subscribeRestChannels(): void {
    this.stompClient.subscribe(`/toClient/${this.currentChat.id}/getMessagesToClient`, (message: IMessage) => {
      this.messages = [];
      const response = JSON.parse(message.body);
      if (response && response.responseNo == 200) {
        console.log("Response for getting messages | ", response.data);
        this.messages = response.data;
      } else {
        console.log(response);
      }
    });

    this.stompClient.subscribe(`/toClient/${this.currentChat.id}/sendResponseToClient`, (message: IMessage) => {
      const response = JSON.parse(message.body);
      if (response && response.responseNo == 200) {
        console.log("Response from sending Message | ", response.data);
      } else {
        console.log(response);
      }
    });

    this.stompClient.subscribe(`/toClient/checkChatRoomToClient`, (message: IMessage) => {
      const response = JSON.parse(message.body);
      if (response && response.responseNo == 200) {
        console.log("Response from checkChatRoom | ", response.data);
        this.currentChat = response.data[0];
      } else {
        console.log(response);
      }
    });
  }

  subscribeMainChannel(): void {
    // Subscribe to your channels here
    this.stompClient.subscribe('/toClient/myChatsToClient', (message: IMessage) => {
      this.userChats = [];
      const response = JSON.parse(message.body);
      if (response && response.responseNo == 200) {
        console.log(response.data);
        this.userChats = response.data;
        this.currentChat = this.userChats[0];

        this.subscribeRestChannels();
        console.clear();

        console.log("this.userChats | ", this.userChats);
      } else {
        console.log(response);

      }
    });

  }

  loadUserData(): void {
    let email = localStorage.getItem('email');
    this.postService.getUserData(email)
      .then(
        user => {
          if (user) {
            this.user = user;
            this.filteredFriends = user.friends;
            this.stompClient.publish({
              destination: '/toServer/chat/myChatsToServer',
              body: JSON.stringify({ userId: this.user.id })
            });
          }
        }
      ).catch(error => {
      console.error(error);
    });
  }


  loadMessages(chatId: string): void {
    this.stompClient.publish({
      destination: `/toServer/chat/${chatId}/getMessagesToServer`
    });
  }

  checkIfChatRoomExists(friend: any): void {
    console.log("HNGUFBMDFZXKIBXF")
    let chat = {
      id: this.postService.generateRandomId(),
      users: [this.user.email, friend.email],
      userIds: [this.user.id, friend.id],
      lastMessage: "",
      lastMessageDate: ""
    }
    this.stompClient.publish({
      destination: '/toServer/chat/checkChatRoomToServer',
      body: JSON.stringify({ chat: chat })
    });
  }

  sendMessage(): void {
    let message = {
      senderId: this.user.id,
      sentDate: new Date().toISOString(),
      message: this.currentMessage
    }
    this.stompClient.publish({
      destination: `/toServer/chat/${this.currentChat.id}/sendToServer`,
      body: JSON.stringify({ message: message })
    });

    this.currentMessage = "";
  }

}
