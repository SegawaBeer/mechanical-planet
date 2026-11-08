// One controllable machine: a robot form and a vehicle form, swapped on
// demand. The forms are plain Object3Ds so a GLB model can take either slot
// later — `setForms` detaches whatever is there and reads the animation hook
// off the new object's `userData`, so a model without one simply stands still.

import * as THREE from 'three';
import { SCHEMES, type SchemeId } from './scheme';
import { buildRobot, type FormState } from './robot';
import { buildVehicle } from './vehicle';

export type Form = 'robot' | 'vehicle';

type Animated = THREE.Object3D & { userData: { anim?: (dt: number, state: FormState) => boolean } };

const noAnim = () => false;

export class Protagonist {
  /** Placed on the planet surface by the Game; local +Y up, +Z forward. */
  readonly root = new THREE.Group();
  readonly name: string;
  readonly scheme: SchemeId;
  form: Form = 'robot';
  /** True on the frame a foot lands, for the footstep sound. */
  footStrike = false;
  /**
   * Invisible sphere over the machine. Picking and the hover cursor raycast
   * against this rather than the model, so a thin or dense model is still easy
   * to click.
   */
  readonly hit: THREE.Mesh;

  private robot: Animated;
  private vehicle: Animated;

  constructor(scheme: SchemeId, name: string) {
    this.scheme = scheme;
    this.name = name;
    const colours = SCHEMES[scheme];
    this.robot = buildRobot(colours).root as Animated;
    this.vehicle = buildVehicle(colours).root as Animated;
    this.hit = new THREE.Mesh(
      new THREE.SphereGeometry(1, 8, 6),
      new THREE.MeshBasicMaterial({ transparent: true, opacity: 0, depthWrite: false })
    );
    this.hit.position.y = 0.9;
    this.attach();
  }

  /**
   * Replace either form with any Object3D, for example a GLB model. The object
   * should be authored with its feet or wheels on y = 0 and +Z forward; an
   * object carrying `userData.anim = (dt, state) => footStrike` will be
   * animated by the game, anything else is left as a static model.
   */
  setForms(robot: THREE.Object3D, vehicle: THREE.Object3D): void {
    this.robot = robot as Animated;
    this.vehicle = vehicle as Animated;
    this.attach();
  }

  /** Replace one form only; the other keeps its built-in model. */
  setFormObject(form: Form, object: THREE.Object3D): void {
    if (form === 'robot') this.robot = object as Animated;
    else this.vehicle = object as Animated;
    this.attach();
  }

  setForm(form: Form): void {
    if (this.form === form && this.root.children.length > 0) return;
    this.form = form;
    this.attach();
  }

  setVisible(visible: boolean): void {
    this.root.visible = visible;
  }

  update(dt: number, state: FormState): void {
    const active = this.form === 'robot' ? this.robot : this.vehicle;
    const anim = active.userData.anim ?? noAnim;
    this.footStrike = anim(dt, state) === true;
  }

  private attach(): void {
    for (const child of [...this.root.children]) this.root.remove(child);
    this.root.add(this.form === 'robot' ? this.robot : this.vehicle, this.hit);
  }
}
