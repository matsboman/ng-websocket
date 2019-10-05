import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { EngineService } from '../services/engine.service';
import { EventService } from '../services/event.service';
import { HostListener } from '@angular/core';
import { ChatService } from '../services/chat.service';

@Component({
  selector: 'app-engine',
  templateUrl: './engine.component.html'
})
export class EngineComponent implements AfterViewInit {
  @ViewChild('rendererCanvas', { static: false })
  public rendererCanvas: ElementRef<HTMLCanvasElement>;

  constructor(
    private engineService: EngineService,
    private eventService: EventService,
    private chatService: ChatService
  ) {
    this.engineService.setScalingFactor(1);
  }

  @HostListener('document:keypress', ['$event'])
  public onKey(event: KeyboardEvent) {
    if (event.key === 't') {
      console.log(event);
      this.engineService.toggleCameraView();
    }
    if (event.key === 'f' && this.engineService.isPlayerShip()) {
      console.log('fire...');
      this.chatService.messages.next({
        message: 'fire',
        name: this.engineService.playerShipName()
      });
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent) {
    if (event.key === 'ArrowRight') {
      this.chatService.messages.next({
        message: 'yaw_right',
        name: this.engineService.playerShipName()
      });
    }
    if (event.key === 'ArrowLeft') {
      this.chatService.messages.next({
        message: 'yaw_left',
        name: this.engineService.playerShipName()
      });
    }
    if (
      event.key === 'ArrowUp' ||
      event.key === 'ArrowDown' ||
      event.key === 'ArrowRight' ||
      event.key === 'ArrowLeft'
    ) {
    }
  }

  ngAfterViewInit() {
    this.engineService.createScene(this.rendererCanvas);
    this.engineService.animate();
    this.eventService.change.subscribe((event: any) => {
      this.handleEvent(event);
    });
  }

  private handleEvent(event: any) {
    const jsonMessage = JSON.parse(event);
    if (jsonMessage.message === 'status') {
      this.updateObjects(jsonMessage.values);
    } else if (jsonMessage.message === 'ping') {
      console.log('ping received');
    } else if (jsonMessage.message === 'newship') {
      console.log(jsonMessage);
      this.engineService.createShip(jsonMessage, true);
      this.chatService.messages.next(jsonMessage);
    } else if (jsonMessage.message === 'new ship created') {
      this.engineService.updateShip(jsonMessage.values);
    } else {
      console.log(jsonMessage);
    }
  }

  private updateObjects(objList: any[]) {
    for (const obj of objList) {
      if (obj.type === 'planet') {
        this.engineService.setPlanetPosition(obj);
      } else if (obj.type === 'ship') {
        this.engineService.updateShip(obj);
      } else if (obj.type === 'shot') {
        this.engineService.updateShot(obj);
      }
    }
  }
}
