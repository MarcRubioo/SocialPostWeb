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

  constructor(
    private postService: PostService,
    private userService: UserService,
  ) {
  }

  async ngOnInit() {
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

}
