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

  private shipArray: Ship[] = [];
  private shotArray: Shot[] = [];
  // private myShipName: string;

  public constructor(private ngZone: NgZone) {}

  public ngOnDestroy() {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }

  public setScalingFactor(factor: number) {
    this.scalingFactor = factor;
  }

  public playerShipName() {
    let name = null;
    for (let i = 0; i < this.shipArray.length; i++) {
      if (this.shipArray[i].isPlayer()) {
        name = this.shipArray[i].getName();
      }
    }
    return name;
  }

  public createShip(values: any, isPlayerShip: boolean) {
    console.log(values);
    const ship = new Ship(
      values.name,
      values.position,
      values.direction,
      isPlayerShip
    );
    this.shipArray.push(ship);
    this.scene.add(ship.getThreeShip());
  }

  public createShot(values: any) {
    const shot: Shot = new Shot(values.name, values.position, values.direction);
    this.shotArray.push(shot);
    return shot.getThreeShot();
  }

  private updateShipPosition(values: any): boolean {
    let isFound = false;
    for (let i = 0; i < this.shipArray.length; i++) {
      if (values.name === this.shipArray[i].getName()) {
        isFound = true;
        this.shipArray[i].update(values.position, values.direction);
      }
    }
    return isFound;
  }

  private updateShotPosition(values: any): boolean {
    let isFound = false;
    for (let i = 0; i < this.shotArray.length; i++) {
      if (values.name === this.shotArray[i].getName()) {
        isFound = true;
        console.log(values.message);
        if (!this.shotArray[i].isDead()) {
          if (values.message === 'died') {
            this.shotArray[i].setDied();
          }
          this.shotArray[i].update(values.position, values.direction);
        } else if (this.shotArray[i].isDead()) {
          this.scene.remove(this.shotArray[i].getThreeShot());
        } else if (values.message === 'terminated') {
          this.shotArray = this.shotArray.filter(
            shot => shot.getName() !== this.shotArray[i].getName()
          );
        }
      }
    }
    return isFound;
  }

  public setPlanetPosition(values: any) {
    const position = {
      x: values.position.x,
      y: values.position.y,
      z: values.position.z
    };
    if (values.name === 'sun') {
      this.sun.position.setX(position.x);
      this.sun.position.setY(position.y);
      this.sun.position.setZ(position.z);
    } else if (values.name === 'earth') {
      this.earth.position.setX(position.x / this.scalingFactor);
      this.earth.position.setY(position.y / this.scalingFactor);
      this.earth.position.setZ(position.z / this.scalingFactor);
    } else if (values.name === 'venus') {
      this.venus.position.setX(position.x / this.scalingFactor);
      this.venus.position.setY(position.y / this.scalingFactor);
      this.venus.position.setZ(position.z / this.scalingFactor);
    }
  }

  public updateShip(values: any) {
    if (!this.updateShipPosition(values)) {
      console.log('adding ship to scene...');
      const ship = this.createShip(values, false);
    } else {
      for (let i = 0; i < this.shipArray.length; i++) {
        if (
          this.shipArray[i].getName() === values.name &&
          this.shipArray[i].isPlayer()
        ) {
          this.camera.updateCamera(values);
        }
      }
    }
  }

  public updateShot(values: any) {
    if (!this.updateShotPosition(values)) {
      const shot = this.createShot(values);
      this.scene.add(shot);
    }
  }

  public toggleCameraView() {
    for (let i = 0; i < this.shipArray.length; i++) {
      if (this.shipArray[i].isPlayer()) {
        console.log(this.shipArray[i]);
        this.camera.toggleCameraView(this.shipArray[i]);
      }
    }
  }

  createScene(canvas: ElementRef<HTMLCanvasElement>): void {
    // The first step is to get the reference of the canvas element from our HTML document
    this.canvas = canvas.nativeElement;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true, // transparent background
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

    const sun = new THREE.SphereGeometry(4, 32, 32);
    const earth = new THREE.SphereGeometry(0.4, 32, 32);
    const venus = new THREE.SphereGeometry(1.4, 32, 32);

    this.sun = new THREE.Mesh(
      sun,
      new THREE.MeshBasicMaterial({ color: 0xffff00 })
    );
    this.earth = new THREE.Mesh(
      earth,
      new THREE.MeshBasicMaterial({ color: 0x000080 })
    );
    this.venus = new THREE.Mesh(
      venus,
      new THREE.MeshBasicMaterial({ color: 0x800000 })
    );
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
