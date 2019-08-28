import { Component, ElementRef, HostBinding, Input, ViewChild } from '@angular/core';
import { EngineService } from './engine.service';
import { EventService } from '../services/event.service';
import { HostListener } from '@angular/core';
import { ChatService } from "../services/chat.service";

@Component({
  selector: 'app-engine',
  templateUrl: './engine.component.html'
})
export class EngineComponent {

  @ViewChild('rendererCanvas')
  public rendererCanvas: ElementRef<HTMLCanvasElement>;

  constructor(private engineService: EngineService,
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
    if (event.key == 'f') {
      console.log('fire...');
      this.chatService.messages.next({
        message: "fire",
        name: this.engineService.playerShipName()
      });
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key == 'ArrowRight') {
      this.chatService.messages.next({
        message: "yaw_right",
        name: this.engineService.playerShipName()
      });
    }
    if (event.key == 'ArrowLeft') {
      this.chatService.messages.next({
        message: "yaw_left",
        name: this.engineService.playerShipName()
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
      this.updateObjects(jsonMessage.values);
    }
    else if (jsonMessage.message == "ping") {
      console.log('ping received');
    }
    else if (jsonMessage.message == "newship") {
      console.log(jsonMessage);
      this.engineService.createShip(jsonMessage, true);
      this.chatService.messages.next(jsonMessage);
    }
    else if (jsonMessage.message == "new ship created") {
      this.engineService.updateShip(jsonMessage.values);
    } else {
      console.log(jsonMessage);
    }
  }

  private updateObjects(objList: any[]) {
    for (let i = 0; i < objList.length; i++) {
      if (objList[i].type == "planet") {
        this.engineService.setPlanetPosition(objList[i]);
      }
      else if (objList[i].type == "ship") {
        this.engineService.updateShip(objList[i]);
      }
      else if (objList[i].type == "shot") {
        this.engineService.updateShot(objList[i]);
      }
    }
  }
}
