import { Injectable, Output, EventEmitter } from '@angular/core'

@Injectable()
export class EventService {

  isOpen = false;

  @Output() change: EventEmitter<any> = new EventEmitter();

  send(msg: any) {
    // console.log('Sending event to component...');
    this.change.emit(msg);
  }

}