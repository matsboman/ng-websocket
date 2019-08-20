import * as THREE from 'three';

export class Ship {
    private name: string;
    private ship: THREE.Mesh;
    private direction = { i: 0, j: 0, k: 0 };

    constructor(name: string, position: any, direction: any) {
      this.name = name;

      var geometry = new THREE.SphereGeometry(0.5, 32, 32);
      var material = new THREE.MeshBasicMaterial({ color: 0x9494ff });
      this.ship = new THREE.Mesh(geometry, material);
  
      this.ship.position.setX(position.x);
      this.ship.position.setY(position.y);
      this.ship.position.setZ(position.z);

      this.direction.i = direction.i;
      this.direction.j = direction.j;
      this.direction.k = direction.k;
    }

    public getThreeShip() {
        return this.ship;
    }

    public getName() {
        return this.name;
    }

    public getPosition() {
        return { x: this.ship.position.x, y: this.ship.position.y, z: this.ship.position.z };
    }

    public getDirection() {
        return { i: this.direction.i, j: this.direction.j, k: this.direction.k };
    }

    public update(position: any, direction: any) {
        this.ship.position.setX(position.x);
        this.ship.position.setY(position.y);
        this.ship.position.setZ(position.z);
        this.direction.i = direction.i;
        this.direction.j = direction.j;
        this.direction.k = direction.k;
    }
}