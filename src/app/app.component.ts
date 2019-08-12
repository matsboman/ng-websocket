import { ChatService } from "./chat.service";
import { interval } from 'rxjs';
import { Component, Output, EventEmitter, HostListener } from '@angular/core';
import { EventService } from './event.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent {

  wsMessage: any;

  constructor(private chatService: ChatService,
    private eventService: EventService) {
    chatService.messages.subscribe(msg => {
      // console.log("Response from websocket: " + msg);
      this.eventService.send(msg);
    });
  }

  ngOnInit() {
    interval(10000).subscribe(() => this.sendMsg());
  }

  private message = {
    author: "tutorialedge",
    message: "this is a test message"
  };

  sendMsg() {
    console.log("new message from client to websocket: ", this.message);
    this.chatService.messages.next(this.message);
    this.message.message = "";
  }
}
