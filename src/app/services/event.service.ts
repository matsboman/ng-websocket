import { Injectable, Output, EventEmitter } from '@angular/core'

@Injectable()
export class EventService {
  @Output() change: EventEmitter<any> = new EventEmitter();

  send(msg: any) {
    this.change.emit(msg);
  }
}