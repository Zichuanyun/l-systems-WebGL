import {vec3, vec4, mat4} from 'gl-matrix';


class Turtle {
  pos: vec3 = vec3.create();
  forward: vec4 = vec4.create();
  rotMat: mat4 = mat4.create();
  depth: number = 0;

  // axises used to construct certain rot mat
  // usage xDir -> curXDir -> curRotMat
  static xDir: vec4 = vec4.fromValues(1.0, 0.0, 0.0, 0.0); 
  static yDir: vec4 = vec4.fromValues(0.0, 1.0, 0.0, 0.0);
  static zDir: vec4 = vec4.fromValues(0.0, 0.0, 1.0, 0.0);
  static R2D: number = 0.0174533;

  constructor(position_: vec3, forward_: vec4, rotMat_: mat4, depth_: number) {
    this.pos = position_;
    this.depth = depth_;
    this.forward = forward_;
    this.rotMat = rotMat_;
  }

  static create(turtle: Turtle): Turtle {
    return new Turtle(vec3.clone(turtle.pos), vec4.clone(turtle.forward), mat4.clone(turtle.rotMat), turtle.depth);
  }

  goForward(step: number) {
    this.pos[0] += step * this.forward[0];
    this.pos[1] += step * this.forward[1];
    this.pos[2] += step * this.forward[2];
  }

  testFunc() {
    this.pos = vec3.fromValues(999, 998, 997);
  }

  rotDeg(deg: number, axis: vec4) {
    let curAixs: vec4 = vec4.create();
    vec4.transformMat4(curAixs, axis, this.rotMat);
    let curAixs3: vec3 = vec3.fromValues(curAixs[0], curAixs[1], curAixs[2]);
    let curRotMat: mat4 = mat4.create();
    mat4.fromRotation(curRotMat, Turtle.R2D * deg, curAixs3);
    // update forward direction
    vec4.transformMat4(this.forward, this.forward, curRotMat);
    // update member rotation mat using this transform mat
    mat4.multiply(this.rotMat, this.rotMat, curRotMat);
  }

  rotXDeg(deg: number) {
    this.rotDeg(deg, Turtle.xDir);
  }

  rotYDeg(deg: number) {
    this.rotDeg(deg, Turtle.yDir);    
  }

  rotZDeg(deg: number) {
    this.rotDeg(deg, Turtle.zDir);    
  }

  increaseDepth() {
    ++this.depth;
  }
}

export default Turtle;