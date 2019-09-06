import * as THREE from 'three';
import { Ship } from './ship.model';

export class Camera {
    private camera: THREE.PerspectiveCamera;
    private isCameraShipView: boolean = false;

    constructor(position: any) {
        this.isCameraShipView = false;
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.resetCamera();
    }

    public getThreeCamera() {
        return this.camera;
    }

    public resize(width: number, height: number) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
    }

    public toggleCameraView(ship: Ship) {
        if (ship == null) {
            return;
        }
        if (!this.isCameraShipView) {
            this.isCameraShipView = true;
            let point = ship.getPosition();
            let direction = ship.getDirection();
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

    public updateCamera(values: any) {
        if (this.isCameraShipView) {
            let position = { x: values.x, y: values.y, z: values.z };
            let direction = { i: values.i, j: values.j, k: values.k };
            this.camera.position.setX(position.x);
            this.camera.position.setY(position.y);
            this.camera.position.setZ(position.z);
            let forwardPoint = this.pointPlusVector(position, this.vectorMultiply(direction, 10));
            this.camera.lookAt(new THREE.Vector3(forwardPoint.x, forwardPoint.y, forwardPoint.z));
        }
    }

    private vectorMultiply(vector: any, speed: number) {
        return { i: vector.i * speed, j: vector.j * speed, k: vector.k * speed };
    }

    private pointPlusVector(point: any, vector: any) {
        return { x: point.x + vector.i, y: point.y + vector.j, z: point.z + vector.k };
    }

    private resetCamera() {
        this.camera.position.setX(0);
        this.camera.position.setY(0);
        this.camera.position.setZ(30);
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    }
}
