import {vec3, vec4, mat4} from 'gl-matrix';


class Turtle {
  pos: vec3 = vec3.create();
  forward: vec3 = vec3.create();
  depth: number = 0;
  R2D: number = 0.0174533;

  constructor(position_: vec3, forward_: vec3, depth_: number) {
    this.pos = position_;
    this.forward = forward_;
    this.depth = depth_;
  }

  static create(turtle: Turtle): Turtle {
    return new Turtle(vec3.clone(turtle.pos), vec3.clone(turtle.forward), turtle.depth);
  }

  goForward(step: number) {
    this.pos[0] += step * this.forward[0];
    this.pos[1] += step * this.forward[1];
    this.pos[2] += step * this.forward[2];
  }

  testFunc() {
    this.pos = vec3.fromValues(999, 998, 997);
  }

  rotXDeg(deg: number) {
    let rotMat: mat4 = mat4.create();
    mat4.fromXRotation(rotMat, this.R2D * deg);
    let temp: vec4 = vec4.fromValues(this.forward[0], this.forward[1], this.forward[2], 0);
    vec4.transformMat4(temp, temp, rotMat);
    this.forward[0] = temp[0];
    this.forward[1] = temp[1];
    this.forward[2] = temp[2];
  }

  rotYDeg(deg: number) {
    let rotMat: mat4 = mat4.create();
    mat4.fromYRotation(rotMat, this.R2D * deg);
    let temp: vec4 = vec4.fromValues(this.forward[0], this.forward[1], this.forward[2], 0);
    vec4.transformMat4(temp, temp, rotMat);
    this.forward[0] = temp[0];
    this.forward[1] = temp[1];
    this.forward[2] = temp[2];
  }

  rotZDeg(deg: number) {
    let rotMat: mat4 = mat4.create();
    mat4.fromZRotation(rotMat, this.R2D * deg);
    let temp: vec4 = vec4.fromValues(this.forward[0], this.forward[1], this.forward[2], 0);
    vec4.transformMat4(temp, temp, rotMat);
    this.forward[0] = temp[0];
    this.forward[1] = temp[1];
    this.forward[2] = temp[2];
  }

  increaseDepth() {
    ++this.depth;
  }
}

export default Turtle;