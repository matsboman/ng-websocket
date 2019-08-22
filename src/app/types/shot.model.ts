import * as THREE from 'three';

export class Shot {
    private name: string;
    private shot: THREE.Mesh;
    private direction = { i: 0, j: 0, k: 0 };

    constructor(name: string, position: any, direction: any) {
      this.name = name;

      var geometry = new THREE.SphereGeometry(0.1, 32, 32);
      var material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      this.shot = new THREE.Mesh(geometry, material);
  
      this.shot.position.setX(position.x);
      this.shot.position.setY(position.y);
      this.shot.position.setZ(position.z);

      this.direction.i = direction.i;
      this.direction.j = direction.j;
      this.direction.k = direction.k;
    }

    public getThreeShot() {
        return this.shot;
    }

    public getName() {
        return this.name;
    }

    public getPosition() {
        return { x: this.shot.position.x, y: this.shot.position.y, z: this.shot.position.z };
    }

    public getDirection() {
        return { i: this.direction.i, j: this.direction.j, k: this.direction.k };
    }

    public update(position: any, direction: any) {
        this.shot.position.setX(position.x);
        this.shot.position.setY(position.y);
        this.shot.position.setZ(position.z);
        this.direction.i = direction.i;
        this.direction.j = direction.j;
        this.direction.k = direction.k;
    }
}