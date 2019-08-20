import * as THREE from 'three';
import { Injectable, ElementRef, OnDestroy, NgZone } from '@angular/core';
import { ShipService } from '../services/ship.service';

@Injectable({
  providedIn: 'root'
})
export class EngineService implements OnDestroy {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private isCameraShipView = false;
  private scene: THREE.Scene;
  private light: THREE.AmbientLight;

  private scalingFactor = 1;
  private sun: THREE.Mesh;
  private earth: THREE.Mesh;
  private venus: THREE.Mesh;

  private frameId: number = null;

  public constructor(private ngZone: NgZone,
    private shipService: ShipService) {
  }

  public ngOnDestroy() {
    if (this.frameId != null) {
      cancelAnimationFrame(this.frameId);
    }
  }

  public setScalingFactor(factor: number) {
    this.scalingFactor = factor;
  }

  public addShip(ship: THREE.Mesh) {
    this.scene.add(ship);
  }

  public setPlanetPosition(name: string, position: any) {
    if (name == 'sun') {
      this.sun.position.setX(position.x);
      this.sun.position.setY(position.y);
      this.sun.position.setZ(position.z);
    }
    else if (name == 'earth') {
      this.earth.position.setX(position.x / this.scalingFactor);
      this.earth.position.setY(position.y / this.scalingFactor);
      this.earth.position.setZ(position.z / this.scalingFactor);
    }
    else if (name == 'venus') {
      this.venus.position.setX(position.x / this.scalingFactor);
      this.venus.position.setY(position.y / this.scalingFactor);
      this.venus.position.setZ(position.z / this.scalingFactor);
    }
  }

  public updateShip(name: string, position: any, direction: any) {
    let isFound = this.shipService.updateShipPosition(name, position, direction);
    if (!isFound) {
      this.addShip(this.shipService.createShip(name, position, direction));
    } else {
      if (this.isCameraShipView) {
        this.camera.position.setX(position.x);
        this.camera.position.setY(position.y);
        this.camera.position.setZ(position.z);
        let forwardPoint = this.pointPlusVector(position, this.vectorMultiply(direction, 10));
        this.camera.lookAt(new THREE.Vector3(forwardPoint.x, forwardPoint.y, forwardPoint.z));
      }
    }
  }

  vectorMultiply(vector: any, speed: number) {
    console.log();
    return { i: vector.i * speed, j: vector.j * speed, k: vector.k * speed };
  }

  pointPlusVector(point: any, vector: any) {
    return { x: point.x + vector.i, y: point.y + vector.j, z: point.z + vector.k};
  }

  public toggleCameraView() {
    console.log(this.isCameraShipView);
    if (!this.isCameraShipView) {
      this.isCameraShipView = true;
      let point = this.shipService.getShipPosition('one');
      let direction = this.shipService.getShipDirection('one');
      let forwardPoint = this.pointPlusVector(point, this.vectorMultiply(direction, 10));
      this.camera.position.setX(point.x);
      this.camera.position.setY(point.y);
      this.camera.position.setZ(point.z);
      this.camera.lookAt(new THREE.Vector3(forwardPoint.x, forwardPoint.y, forwardPoint.z));
    } else {
      this.isCameraShipView = false;
      this.camera.position.setX(0);
      this.camera.position.setY(0);
      this.camera.position.setZ(60);
      this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }
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

    this.camera = new THREE.PerspectiveCamera(
      75, window.innerWidth / window.innerHeight, 0.1, 1000
    );
    this.camera.position.z = 60;
    this.scene.add(this.camera);

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
    this.renderer.render(this.scene, this.camera);
  }

  resize() {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(width, height);
  }
}
