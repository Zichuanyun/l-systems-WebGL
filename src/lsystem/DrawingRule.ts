import {vec3, vec4, mat4} from 'gl-matrix';
import Turtle from './Turtle';



class DrawingRule {

  posArray: Array<number> = new Array();
  rotArray: Array<number> = new Array();
  scaleArray: Array<number> = new Array();
  turtle: Turtle = new Turtle(vec3.fromValues(0.0, 0.0, 0.0), vec3.fromValues(0.0, 1.0, 0.0), 0); 
  stackT: Array<Turtle> = new Array();

  rules: Map<string, any> = new Map();
  forwardStep: number = 10;
  xRot: number = 90;
  yRot: number = 90;
  zRot: number = 90;
  scalingFactor: number = 0.5;
  a: number = 0;

  constructor() {
    this.rules.set('F', goForward.bind(this));
    this.rules.set('[', pushTurtle.bind(this));
    this.rules.set(']', popTurtle.bind(this));
    this.rules.set('1', rotX.bind(this));
    this.rules.set('2', rotY.bind(this));
    this.rules.set('3', rotZ.bind(this));
  }

  processAndFillArray(str: string, posArray_: Array<number>,
    rotArray_: Array<number>, scaleArray_: Array<number>) {

    for (var i = 0; i < str.length; ++i) {
      let curChar: string = str.substring(i, i + 1);
      let func = this.rules.get(curChar);
      if(func) { // Check that the map contains a value for this key
        func();
      }
    }

    posArray_.push.apply(posArray_, this.posArray);
    rotArray_.push.apply(rotArray_, this.rotArray);
    scaleArray_.push.apply(scaleArray_,this.scaleArray);
  }
}

function rotX() {
  this.turtle.rotXDeg(this.xRot);
}

function rotY() {
  this.turtle.rotYDeg(this.yRot);

}

function rotZ() {
  this.turtle.rotZDeg(this.zRot);

}

function goForward() {
  this.posArray.push(this.turtle.pos[0]);
  this.posArray.push(this.turtle.pos[1]);
  this.posArray.push(this.turtle.pos[2]);

  this.rotArray.push(this.turtle.forward[0]);
  this.rotArray.push(this.turtle.forward[1]);
  this.rotArray.push(this.turtle.forward[2]);

  let curScale: number = Math.pow(this.scalingFactor, this.turtle.depth);
  this.scaleArray.push(curScale);
  this.scaleArray.push(1);
  this.scaleArray.push(curScale);
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