import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { WebsocketService } from "./websocket.service";
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

// const CHAT_URL = "ws://echo.websocket.org/";
const CHAT_URL = "ws://localhost:9090/websocket";

export interface Message {
  message: string;
  name: string;
}

@Injectable()
export class ChatService {
  public messages: Subject<Message>;

  constructor(wsService: WebsocketService) {
    this.messages = <Subject<Message>>wsService.connect(CHAT_URL).map(
      (response: MessageEvent): Message => {
        // console.log(response);
        return response.data;
      }
    );
  }
}