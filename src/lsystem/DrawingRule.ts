import {vec3, vec4, mat4} from 'gl-matrix';
import Turtle from './Turtle';



class DrawingRule {

  posArray: Array<number> = new Array();
  rotArray: Array<number> = new Array();
  depthArray: Array<number> = new Array();
  turtle: Turtle; 
  stackT: Array<Turtle> = new Array();

  rules: Map<string, any> = new Map();
  forwardStep: number = 2.5;
  xRot: number = 30;
  yRot: number = 30;
  zRot: number = 30;
  scalingFactor: number = 0.5;
  a: number = 0;

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
  }

  processAndFillArray(str: string, posArray_: Array<number>,
    rotArray_: Array<number>, depthArray_: Array<number>) {
    let dientityMat4: mat4 = mat4.create(); // used to construct a new turtle
    mat4.identity(dientityMat4);
    this.turtle = new Turtle(
    vec3.fromValues(0.0, 0.0, 0.0),       // pos
    vec4.fromValues(0.0, 1.0, 0.0, 0.0),  // forward
    dientityMat4,                         // rot mat
    0);                                   // depth

    this.posArray.length = 0;
    this.rotArray.length = 0;
    this.depthArray.length = 0;
    this.stackT.length = 0;
    
    for (var i = 0; i < str.length; ++i) {
      let curChar: string = str.substring(i, i + 1);
      console.log("processing: " + curChar);
      let func = this.rules.get(curChar);
      if(func) { // Check that the map contains a value for this key
        func();
      }
    }
    posArray_.push.apply(posArray_, this.posArray);
    rotArray_.push.apply(rotArray_, this.rotArray);
    depthArray_.push.apply(depthArray_,this.depthArray);
  }
}

function rotX() {
  this.turtle.rotXDeg(this.xRot);
}

function rotX_() {
  this.turtle.rotXDeg(-this.xRot);
}

function rotY() {
  this.turtle.rotYDeg(this.yRot);
}

function rotY_() {
  this.turtle.rotYDeg(-this.yRot);
}

function rotZ() {
  this.turtle.rotZDeg(this.zRot);
}

function rotZ_() {
  this.turtle.rotZDeg(-this.zRot);
}

function goForward() {
  // console.log("encounter F");
  // console.log(this.turtle);
  // console.log("pos: " + this.turtle.pos);
  // console.log("forward: " + this.turtle.forward);

  this.posArray.push(this.turtle.pos[0]);
  this.posArray.push(this.turtle.pos[1]);
  this.posArray.push(this.turtle.pos[2]);

  this.rotArray.push(this.turtle.forward[0]);
  this.rotArray.push(this.turtle.forward[1]);
  this.rotArray.push(this.turtle.forward[2]);

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