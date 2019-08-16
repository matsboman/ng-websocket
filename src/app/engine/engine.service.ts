import * as THREE from 'three';
import { Injectable, ElementRef, OnDestroy, NgZone } from '@angular/core';
import { ShipService } from '../services/ship.service';
import { PlayPoint } from '../types/play-point.model';
import { Ship } from '../types/ship.model';

@Injectable({
  providedIn: 'root'
})
export class EngineService implements OnDestroy {
  private canvas: HTMLCanvasElement;
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
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

  public setPos(objectName: string, position: any) {
    if (objectName == 'sun') {
      this.sun.position.setX(position.x);
      this.sun.position.setY(position.y);
      this.sun.position.setZ(position.z);
    }
    else if (objectName == 'earth') {
      this.earth.position.setX(position.x / this.scalingFactor);
      this.earth.position.setY(position.y / this.scalingFactor);
      this.earth.position.setZ(position.z / this.scalingFactor);
    }
    else if (objectName == 'venus') {
      this.venus.position.setX(position.x / this.scalingFactor);
      this.venus.position.setY(position.y / this.scalingFactor);
      this.venus.position.setZ(position.z / this.scalingFactor);
    }
    else {
      if (!this.shipService.updateShipPosition(objectName, position)) {
        this.addShip(this.shipService.createShip(name, position));
      }
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
    this.camera.position.z = 40;
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
