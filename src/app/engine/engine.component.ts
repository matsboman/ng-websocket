import { Component, ElementRef, HostBinding, Input, ViewChild } from '@angular/core';
import { EngineService } from './engine.service';
import { EventService } from '../services/event.service';
import { PlayObject } from '../types/play-object.model';

@Component({
  selector: 'app-engine',
  templateUrl: './engine.component.html'
})
export class EngineComponent {

  @ViewChild('rendererCanvas')
  public rendererCanvas: ElementRef<HTMLCanvasElement>;

  constructor(private engServ: EngineService,
    private eventService: EventService
    ) { }

  ngOnInit() {
    this.engServ.createScene(this.rendererCanvas);
    this.engServ.animate();
    this.eventService.change.subscribe(msg => {
      // console.log('got message from component: ' + msg);
      if (msg.indexOf('That') < 0) {
        let objList: PlayObject[] = JSON.parse(msg);
        // console.log(objList[0].position);
        this.engServ.setPosX(objList[0].position / 100.0);
      }
    });
  }

}
