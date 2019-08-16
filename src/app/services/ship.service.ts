import { Injectable } from '@angular/core';
import { PlayPoint } from '../types/play-point.model';
import { Ship } from '../types/ship.model';

@Injectable({
  providedIn: 'root'
})
export class ShipService {
  private shipArray: Ship[] = [];

  constructor() { }

  public createShip(name: string, position: any) {
    var ship = new Ship(name, new PlayPoint(position.x, position.y, position.z));
    this.shipArray.push(ship);
    return ship.getThreeShip();
  }

  public updateShipPosition(name: string, position: any): boolean {
    let isFound = false;
    for (let i = 0; i < this.shipArray.length; i++) {
      if (this.shipArray[i].getName() == name) {
        isFound = true;
        this.shipArray[i].updatePosition(position);
      }
    }
    return isFound;
  }
}
