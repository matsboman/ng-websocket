import { ChatService } from './services/chat.service';
import { interval } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { EventService } from './services/event.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: []
})
export class AppComponent implements OnInit {
  private message = {
    name: 'game client',
    message: 'keepalive'
  };
  wsMessage: any;

  constructor(
    private chatService: ChatService,
    private eventService: EventService
  ) {
    chatService.messages.subscribe(msg => {
      this.eventService.send(msg);
    });
  }

  ngOnInit() {
    interval(10000).subscribe(() => this.sendMsg());
  }

  sendMsg() {
    this.chatService.messages.next(this.message);
  }
}
