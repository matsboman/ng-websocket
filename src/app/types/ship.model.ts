import { PlayPoint } from "./play-point.model";
import * as THREE from 'three';

export class Ship {
    private position: PlayPoint = new PlayPoint(10, 0, 0);
    private name: string;
    private ship: THREE.Mesh;

    constructor(name: string, position: PlayPoint) {
      this.name = name;

      var geometry = new THREE.SphereGeometry(0.5, 32, 32);
      var material = new THREE.MeshBasicMaterial({ color: 0x9494ff });
      this.ship = new THREE.Mesh(geometry, material);
  
      this.ship.position.setX(position.x);
      this.ship.position.setY(position.y);
      this.ship.position.setZ(position.z);
    }

    public getThreeShip() {
        return this.ship;
    }

    public getName() {
        return this.name;
    }

    public updatePosition(position: PlayPoint) {
        this.ship.position.setX(position.x);
        this.ship.position.setY(position.y);
        this.ship.position.setZ(position.z);
    }
}