import * as THREE from 'three';
import { Injectable, ElementRef, OnDestroy, NgZone } from '@angular/core';
import { Ship } from '../types/ship.model';
import { Camera } from '../types/camera.model';
import { Shot } from '../types/shot.model';

@Injectable({
  providedIn: 'root'
})
export class EngineService implements OnDestroy {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: Camera;
  private scene: THREE.Scene;
  private light: THREE.AmbientLight;

  private scalingFactor = 1;
  private sun: THREE.Mesh;
  private earth: THREE.Mesh;
  private venus: THREE.Mesh;

  private frameId: number = null;

  private ship: Ship = null;

  private shotArray: Shot[] = [];

  public constructor(private ngZone: NgZone) {
  }

  public ngOnDestroy() {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }

  public setScalingFactor(factor: number) {
    this.scalingFactor = factor;
  }

  public createShip(values: any) {
    let position = { x: values.positionX, y: values.positionY, z: values.positionZ };
    let direction = { i: values.directionI, j: values.directionJ, k: values.directionK };
    this.ship = new Ship(values.name, position, direction);
    return this.ship.getThreeShip();
  }

  public createShot(values: any) {
    let position = { x: values.positionX, y: values.positionY, z: values.positionZ };
    let direction = { i: values.directionI, j: values.directionJ, k: values.directionK };
    var shot: Shot = new Shot(values.name, position, direction);
    this.shotArray.push(shot);
    return shot.getThreeShot();
  }

  private updateShipPosition(values: any): boolean {
    if (this.ship == null) {
      return false;
    }
    let position = { x: values.positionX, y: values.positionY, z: values.positionZ };
    let direction = { i: values.directionI, j: values.directionJ, k: values.directionK };
    this.ship.update(position, direction);
    return true;
  }

  private updateShotPosition(values: any): boolean {
    var isFound = false;
    for (let i = 0; i < this.shotArray.length; i++) {
      if (values.name == this.shotArray[i].getName()) {
        let position = { x: values.positionX, y: values.positionY, z: values.positionZ };
        let direction = { i: values.directionI, j: values.directionJ, k: values.directionK };
        this.shotArray[i].update(position, direction);
        isFound = true;
      }
    }
    return isFound;
  }

  public setPlanetPosition(values: any) {
    var position = { x: values.position.x, y: values.position.y, z: values.position.z };
    if (values.name == 'sun') {
      this.sun.position.setX(position.x);
      this.sun.position.setY(position.y);
      this.sun.position.setZ(position.z);
    }
    else if (values.name == 'earth') {
      this.earth.position.setX(position.x / this.scalingFactor);
      this.earth.position.setY(position.y / this.scalingFactor);
      this.earth.position.setZ(position.z / this.scalingFactor);
    }
    else if (values.name == 'venus') {
      this.venus.position.setX(position.x / this.scalingFactor);
      this.venus.position.setY(position.y / this.scalingFactor);
      this.venus.position.setZ(position.z / this.scalingFactor);
    }
  }

  public updateShip(values: any) {
    if (!this.updateShipPosition(values)) {
      var ship = this.createShip(values);
      this.scene.add(ship);
    } else {
      this.camera.updateCamera(values);
    }
  }

  public updateShot(values: any) {
    if (!this.updateShotPosition(values)) {
      var shot = this.createShot(values);
      this.scene.add(shot);
    }
  }

  public toggleCameraView() {
    this.camera.toggleCameraView(this.ship);
  }

  createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,    // transparent background
      antialias: true // smooth edges
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    // create the scene
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x000000);

    this.camera = new Camera({ x: 0, y: 0, z: 60 });
    this.scene.add(this.camera.getThreeCamera());

    // soft white light
    this.light = new THREE.AmbientLight(0x404040);
    this.light.position.z = 10;
    this.scene.add(this.light);

    var sun = new THREE.SphereGeometry(4, 32, 32);
    var earth = new THREE.SphereGeometry(0.4, 32, 32);
    var venus = new THREE.SphereGeometry(1.4, 32, 32);

    this.sun = new THREE.Mesh(sun, new THREE.MeshBasicMaterial({ color: 0xffff00 }));
    this.earth = new THREE.Mesh(earth, new THREE.MeshBasicMaterial({ color: 0x000080 }));
    this.venus = new THREE.Mesh(venus, new THREE.MeshBasicMaterial({ color: 0x800000 }));
    this.scene.add(this.sun);
    this.scene.add(this.earth);
    this.scene.add(this.venus);
  }

  animate(): void {
    // We have to run this outside angular zones,
    // because it could trigger heavy changeDetection cycles.
    this.ngZone.runOutsideAngular(() => {
      window.addEventListener('DOMContentLoaded', () => {
        this.render();
      });
      window.addEventListener('resize', () => {
        this.resize();
      });
    });
  }

  render() {
    this.frameId = requestAnimationFrame(() => {
      this.render();
    });
    this.renderer.render(this.scene, this.camera.getThreeCamera());
  }

  resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    this.camera.resize(width, height);
    this.renderer.setSize(width, height);
  }
}
