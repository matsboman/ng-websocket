import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { EventService } from '../../services/event.service';

@Component({
  selector: 'app-ui-infobar-top',
  templateUrl: './ui-infobar-top.component.html',
  styleUrls: ['./ui-infobar-top.component.css',
    '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css']
})
export class UiInfobarTopComponent implements OnInit {
  positionForm: FormGroup;
  directionForm: FormGroup;
  speedForm: FormGroup;
  nameForm: FormGroup;

  shipsArray: any[] = [];

  constructor(private formBuilder: FormBuilder,
    private eventService: EventService) { }

  ngOnInit() {
    this.positionForm = this.formBuilder.group({ posX: [0.0], posY: [0.0], posZ: [0.0] });
    this.directionForm = this.formBuilder.group({ dirI: [0.0], dirJ: [0.0], dirK: [0.0] });
    this.speedForm = this.formBuilder.group({ speed: [0.0] });
    this.nameForm = this.formBuilder.group({ name: [] });
    this.eventService.change.subscribe(event => {
      this.handleEvent(event);
    });
  }

  private shipsIncludes(name: string): boolean {
    let isFound: boolean = false;
    for (let i = 0; i < this.shipsArray.length; i++) {
      if (this.shipsArray[i].name == name) {
        isFound = true;
      }
    }
    return isFound;
  }

  private updatePosition(name: string, position: any) {
    for (let i = 0; i < this.shipsArray.length; i++) {
      if (this.shipsArray[i].name == name) {
        this.shipsArray[i].posX = position.x;
        this.shipsArray[i].posY = position.y;
        this.shipsArray[i].posZ = position.z;
      }
    }
  }

  private handleEvent(event: any) {
    let jsonMessage = JSON.parse(event);
    if (jsonMessage.message == "status") {
      var values = jsonMessage.values;
      for (let i = 0; i < values.length; i++) {
        if (values[i].type == "ship") {
          var shipName = values[i].name;
          var pos = values[i].position;
          if (!this.shipsIncludes(shipName)) {
            this.shipsArray.push({
              name: values[i].name,
              posX: values[i].position.x, posY: values[i].position.y, posZ: values[i].position.z
            });
            // console.log(this.shipsArray);
          } else {
            this.updatePosition(shipName, pos);
          }
        }
      }
    }
  }

  public onCreateShip() {
    this.eventService.send(JSON.stringify(
      {
        message: "newship",
        position: {
          x: this.positionForm.controls['posX'].value,
          y: this.positionForm.controls['posY'].value,
          z: this.positionForm.controls['posZ'].value
        },
        direction: {
          i: this.directionForm.controls['dirI'].value,
          j: this.directionForm.controls['dirJ'].value,
          k: this.directionForm.controls['dirK'].value
        },
        speed: this.speedForm.controls['speed'].value,
        name: this.nameForm.controls['name'].value
      }));
  }

}
