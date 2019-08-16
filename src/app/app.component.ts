import { ChatService } from "./services/chat.service";
import { interval } from 'rxjs';
import { Component, Output, EventEmitter, HostListener } from '@angular/core';
import { EventService } from './services/event.service';

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
      this.eventService.send(msg);
    });
  }

  ngOnInit() {
    interval(10000).subscribe(() => this.sendMsg());
  }

  private message = {
    author: "game client",
    message: "keepalive"
  };

  sendMsg() {
    this.chatService.messages.next(this.message);
  }
}
