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

  constructor(private formBuilder: FormBuilder,
    private eventService: EventService) { }

  ngOnInit() {
    this.positionForm = this.formBuilder.group({posX: [0.0], posY: [0.0], posZ: [0.0]});
    this.directionForm = this.formBuilder.group({dirI: [0.0], dirJ: [0.0], dirK: [0.0]});
    this.speedForm = this.formBuilder.group({speed: [0.0]});
    this.nameForm = this.formBuilder.group({name: []});
  }

  public onCreateShip() {
    this.eventService.send(JSON.stringify(
      {
        message: "newship",
        positionX: this.positionForm.controls['posX'].value,
        positionY: this.positionForm.controls['posY'].value,
        positionZ: this.positionForm.controls['posZ'].value,
        directionI: this.directionForm.controls['dirI'].value,
        directionJ: this.directionForm.controls['dirJ'].value,
        directionK: this.directionForm.controls['dirK'].value,
        speed: this.speedForm.controls['speed'].value,
        name: this.nameForm.controls['name'].value
      }));
  }

}
