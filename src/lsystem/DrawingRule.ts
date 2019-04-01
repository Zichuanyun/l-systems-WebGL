import {vec3, vec4, mat4, quat} from 'gl-matrix';
import Turtle from './Turtle';



class DrawingRule {
  posArray: Array<number> = new Array();
  rotArray: Array<number> = new Array();
  depthArray: Array<number> = new Array();

  fPosArray: Array<number> = new Array();
  fRotArray: Array<number> = new Array();
  fDepthArray: Array<number> = new Array();

  turtle: Turtle; 
  stackT: Array<Turtle> = new Array();

  rules: Map<string, any> = new Map();
  forwardStep: number = 2;
  xRot: number = 30;
  xRotRandom: number = 5;

  yRot: number = 5;
  yRotRandom: number = 5;

  zRot: number = 36;
  zRotRandom: number = 5;

  scalingFactor: number = 0.5;

  constructor() {
    this.rules.set('F', goForward.bind(this));
    this.rules.set('[', pushTurtle.bind(this));
    this.rules.set(']', popTurtle.bind(this));
    this.rules.set('+', rotX.bind(this));
    this.rules.set('-', rotX_.bind(this));
    this.rules.set('<', rotY.bind(this));
    this.rules.set('>', rotY_.bind(this));
    this.rules.set(',', rotZ.bind(this));
    this.rules.set('.', rotZ_.bind(this));
    this.rules.set('*', addFlower.bind(this));
  }

  processAndFillArray(str: string,
    posArray_: Array<number>,
    rotArray_: Array<number>,
    depthArray_: Array<number>,
    fPosArray_: Array<number>,
    fRotArray_: Array<number>,
    fDepthArray_: Array<number>) {
    let identityMat4: mat4 = mat4.create(); // used to construct a new turtle
    mat4.identity(identityMat4);
    this.turtle = new Turtle(
    vec3.fromValues(0.0, 0.0, 0.0),       // pos
    vec4.fromValues(0.0, 1.0, 0.0, 0.0),  // forward
    identityMat4,                         // rot mat
    0);                                   // depth

    // branches
    this.posArray.length = 0;
    this.rotArray.length = 0;
    this.depthArray.length = 0;
    // flowers
    this.fPosArray.length = 0;
    this.fRotArray.length = 0;
    this.fDepthArray.length = 0;
    // stack
    this.stackT.length = 0;
    
    for (var i = 0; i < str.length; ++i) {
      let curChar: string = str.substring(i, i + 1);
      // console.log("processing: " + curChar);
      let func = this.rules.get(curChar);
      if(func) { // Check that the map contains a value for this key
        func();
      }
    }
    // branches
    posArray_.push.apply(posArray_, this.posArray);
    rotArray_.push.apply(rotArray_, this.rotArray);
    depthArray_.push.apply(depthArray_,this.depthArray);
    // flowers
    fPosArray_.push.apply(fPosArray_, this.fPosArray);
    fRotArray_.push.apply(fRotArray_, this.fRotArray);
    fDepthArray_.push.apply(fDepthArray_, this.fDepthArray);
  }
}

function rotX() {
  this.turtle.rotXDeg(this.xRot + getRandRange(this.xRotRandom));
}

function rotX_() {
  this.turtle.rotXDeg(-this.xRot + getRandRange(this.xRotRandom));
}

function rotY() {
  this.turtle.rotYDeg(this.yRot) + getRandRange(this.yRotRandom);
}

function rotY_() {
  this.turtle.rotYDeg(-this.yRot + getRandRange(this.yRotRandom));
}

function rotZ() {
  this.turtle.rotZDeg(this.zRot + getRandRange(this.zRotRandom));
}

function rotZ_() {
  this.turtle.rotZDeg(-this.zRot + getRandRange(this.zRotRandom));
}

function getRandRange(rand: number): number {
  return 2 * Math.random() * rand - rand;
}

function addFlower() {
  this.fPosArray.push(this.turtle.pos[0]);
  this.fPosArray.push(this.turtle.pos[1]);
  this.fPosArray.push(this.turtle.pos[2]);
  
  let curRot: quat = quat.create();
  mat4.getRotation(curRot, this.turtle.rotMat);
  quat.normalize(curRot, curRot);

  this.fRotArray.push(curRot[0]);
  this.fRotArray.push(curRot[1]);
  this.fRotArray.push(curRot[2]);
  this.fRotArray.push(curRot[3]);

  this.fDepthArray.push(this.turtle.depth);
}

function goForward() {

  this.posArray.push(this.turtle.pos[0]);
  this.posArray.push(this.turtle.pos[1]);
  this.posArray.push(this.turtle.pos[2]);
  
  let curRot: quat = quat.create();
  mat4.getRotation(curRot, this.turtle.rotMat);
  quat.normalize(curRot, curRot);

  this.rotArray.push(curRot[0]);
  this.rotArray.push(curRot[1]);
  this.rotArray.push(curRot[2]);
  this.rotArray.push(curRot[3]);

  this.depthArray.push(this.turtle.depth);
  this.turtle.goForward(this.forwardStep);
}

function pushTurtle() {
  this.stackT.push(Turtle.create(this.turtle));
  this.turtle.increaseDepth();
}

function popTurtle() {
  this.turtle = this.stackT[this.stackT.length - 1];
  this.stackT.pop();
}

export default DrawingRule;