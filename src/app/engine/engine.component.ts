import { Component, ElementRef, HostBinding, Input, ViewChild } from '@angular/core';
import { EngineService } from './engine.service';
import { EventService } from '../services/event.service';
import { HostListener } from '@angular/core';
import { ChatService } from "../services/chat.service";
import { PlayPoint } from '../types/play-point.model';
import { ShipService } from '../services/ship.service';

@Component({
  selector: 'app-engine',
  templateUrl: './engine.component.html'
})
export class EngineComponent {

  @ViewChild('rendererCanvas')
  public rendererCanvas: ElementRef<HTMLCanvasElement>;

  constructor(private engineService: EngineService,
    private shipService: ShipService,
    private eventService: EventService,
    private chatService: ChatService) {
    this.engineService.setScalingFactor(1);
  }

  // @HostListener('document:keypress', ['$event'])
  // public onKey(event: KeyboardEvent) {
  //   console.log(event);
  //   if (event.key == 'b') {
  //     this.engineService.setNegativeDirection();
  //   }
  // }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key == 'ArrowUp' ||
      event.key == 'ArrowDown' ||
      event.key == 'ArrowRight' ||
      event.key == 'ArrowLeft') {
        console.log(event.key);
    }
  }

  ngOnInit() {
    this.engineService.createScene(this.rendererCanvas);
    this.engineService.animate();
    this.eventService.change.subscribe(event => {
      this.handleEvent(event);
    });
  }

  private handleEvent(event: any) {
    let jsonMessage = JSON.parse(event);
    if (jsonMessage.message == "objects") {
      // console.log(jsonMessage);
      this.setObjectPosition(jsonMessage.values);
    }
    else if (jsonMessage.message == "ping") {
      console.log('ping received');
    } 
    else if (jsonMessage.message == "newship") {
      console.log(jsonMessage);
      this.chatService.messages.next(jsonMessage);
    } 
    else if (jsonMessage.message == "new ship created") {
      let values = jsonMessage.values;
      let position: PlayPoint = new PlayPoint(values.positionX, values.positionY, values.positionZ);
      this.engineService.addShip(this.shipService.createShip(jsonMessage.values.name, position));
    } else {
      console.log(jsonMessage);
    }
  }

  private setObjectPosition(objList: any[]) {
    for (let i = 0; i < objList.length; i++) {
      this.engineService.setPos(objList[i].object,
        {
          x: parseFloat(objList[i].position.x),
          y: parseFloat(objList[i].position.y),
          z: parseFloat(objList[i].position.z),
        });
    }
  }
}
