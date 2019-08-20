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

  @HostListener('document:keypress', ['$event'])
  public onKey(event: KeyboardEvent) {
    if (event.key == 't') {
      console.log(event);
      this.engineService.toggleCameraView();
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key == 'ArrowRight') {
      this.chatService.messages.next({
        message: "yaw_right",
        author: ""
      });
    }
    if (event.key == 'ArrowLeft') {
      this.chatService.messages.next({
        message: "yaw_left",
        author: ""
      });
    }
    if (event.key == 'ArrowUp' ||
      event.key == 'ArrowDown' ||
      event.key == 'ArrowRight' ||
      event.key == 'ArrowLeft') {
      
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
    if (jsonMessage.message == "status") {
      // console.log(jsonMessage);
      this.updateObjects(jsonMessage.values);
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
      this.engineService.addShip(this.shipService.createShip(
        jsonMessage.values.name,
        { x: values.positionX, y: values.positionY, z: values.positionZ },
        { i: values.directionI, j: values.directionJ, k: values.directionK }));
    } else {
      console.log(jsonMessage);
    }
  }

  private updateObjects(objList: any[]) {
    for (let i = 0; i < objList.length; i++) {
      if (objList[i].type == "planet") {
        this.engineService.setPlanetPosition(objList[i].name,
          { x: objList[i].position.x, y: objList[i].position.y, z: objList[i].position.z });
      }
      else if (objList[i].type == "ship") {
        this.engineService.updateShip(objList[i].name,
          { x: objList[i].positionX, y: objList[i].positionY, z: objList[i].positionZ },
          { i: objList[i].directionI, j: objList[i].directionJ, k: objList[i].directionK });
      }
    }
  }
}
