import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {PostService} from "../post.service";
import {UserService} from "../user.service";
import {FormControl} from "@angular/forms";
import * as SockJS from "sockjs-client";
import {Client, Frame, IMessage} from "@stomp/stompjs";

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {

  @ViewChild('endOfChat') endOfChat: ElementRef;

  socket: any;
  stompClient: Client;
  searchFormControl = new FormControl();
  chatListControl = new FormControl();
  messageControl = new FormControl();

  user: any;
  userChats: any[] = [];
  messages: any[] = [];
  currentChat: any;

  filteredFriends: any[] = [];

  constructor(
    private postService: PostService,
    private userService: UserService,
  ) {
  }

  filterFriends(): void {
    const value = this.searchFormControl.value.toLowerCase();
    this.filteredFriends = this.user.friends.filter(friend => friend.email.toLowerCase().includes(value));
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
    this.stompClient.subscribe(`/toClient/${this.currentChat.id}/sendResponseToClient`, (message: IMessage) => {
      const response = JSON.parse(message.body);
      if (response && response.responseNo == 200) {
        console.log("Response from sending Message | ", response.data);
      } else {
        console.log(response);
      }
    });
  }

  subscribeMainChannel(): void {
    this.stompClient.subscribe('/toClient/myChatsToClient', (message: IMessage) => {
      this.userChats = [];
      const response = JSON.parse(message.body);
      if (response && response.responseNo == 200) {
        console.log(response.data);
        this.userChats = response.data;

        this.userChats.sort((a, b) => {
          const dateA = new Date(a.lastMessageDate).getTime();
          const dateB = new Date(b.lastMessageDate).getTime();
          return dateB - dateA;
        });

        console.clear();
        console.log("this.userChats | ", this.userChats);

        this.subscribeRestChannels();
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
              body: JSON.stringify({userId: this.user.id})
            });
          }
        }
      ).catch(error => {
      console.error(error);
    });
  }


  loadMessages(chat: any): void {

    this.currentChat = chat;
    this.stompClient.publish({
      destination: `/toServer/chat/${chat.id}/getMessagesToServer`
    });
    this.stompClient.subscribe(`/toClient/${this.currentChat.id}/getMessagesToClient`, (message: IMessage) => {
      const response = JSON.parse(message.body);
      if (response && response.responseNo == 200) {
        console.log("Response for getting messages | ", response.data);

        this.messages = response.data.map((msg: any) => ({
          ...msg,
          sentDate: new Date(msg.sentDate)
        })).sort((a: any, b: any) => {
          return new Date(a.sentDate).getTime() - new Date(b.sentDate).getTime();
        });

        this.scrollToBottom();
      } else {
        console.log(response);
      }
    });

  }

  checkIfChatRoomExists(friend: any): void {
    let chat = {
      id: this.postService.generateRandomId(),
      users: [this.user.email, friend.email],
      userIds: [this.user.id, friend.id],
      lastMessage: "",
      lastMessageDate: ""
    }
    this.stompClient.publish({
      destination: '/toServer/chat/checkChatRoomToServer',
      body: JSON.stringify({chat: chat})
    });

    this.stompClient.subscribe(`/toClient/checkChatRoomToClient`, (message: IMessage) => {
      const response = JSON.parse(message.body);
      if (response && response.responseNo == 200) {
        console.log("Response from checkChatRoom | ", response);
        console.log(response.data);
        // this.currentChat = response.data[0];
        this.userChats.push(response.data[0]);
        this.loadMessages(this.currentChat.id);
      } else if (response && response.responseNo == 400 && response.data) {
        console.log("CHAT ALREADY EXISTS!!")
      } else {
        console.log(response);
      }
    });
  }

  sendMessage(): void {
    let message = {
      senderId: this.user.id,
      sentDate: new Date().toISOString(),
      message: this.messageControl.value
    }

    this.stompClient.publish({
      destination: `/toServer/chat/${this.currentChat.id}/sendToServer`,
      body: JSON.stringify({message: message})
    });

    const chatIndex = this.userChats.findIndex(chat => chat.id === this.currentChat.id);
    if (chatIndex !== -1) {
      // Update lastMessage and lastMessageDate
      this.userChats[chatIndex].lastMessage = this.messageControl.value;
      this.userChats[chatIndex].lastMessageDate = message.sentDate;
    }
    this.messageControl.setValue("");

    this.userChats.sort((a, b) => {
      const dateA = new Date(a.lastMessageDate).getTime();
      const dateB = new Date(b.lastMessageDate).getTime();
      return dateB - dateA;
    });

  }


  getFriendImage(chat: any): string {
    const friendEmail = (chat.users[1] == localStorage.getItem('email')) ? chat.users[0] : chat.users[1];
    // console.log("email of friend |", friendEmail);
    // this.user.friends.forEach(friend => {
    //   console.log("Friend at for loop | ", friend);
    // });
    const friend = this.user.friends.find(friend => friend.email == friendEmail);
    // console.log("Friend at getFriendImage | ", friend);
    return friend.img;
  }

  getUserName(chat: any): string {
    const friendEmail = chat.users[1] === localStorage.getItem('email') ? chat.users[0] : chat.users[1];
    const friend = this.user.friends.find(friend => friend.email === friendEmail);
    return friend.firstName;
  }

  scrollToBottom(): void {
    setTimeout(() => {
      if (this.endOfChat) {
        this.endOfChat.nativeElement.scrollIntoView({ behavior: "smooth" })
      }
    }, 100);
  }

  protected readonly localStorage = localStorage;
}
