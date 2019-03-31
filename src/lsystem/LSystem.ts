import Turtle from './Turtle';
import ExpansionRule from './ExpansionRule';
import DrawingRule from './DrawingRule';
import {vec3, quat} from 'gl-matrix';

// arrays to store sacle, pos, rot
class LSystem {
  expansionRule: ExpansionRule = new ExpansionRule();
  drawingRule: DrawingRule = new DrawingRule();
  initStr: string = 'F';
  iter: number = 3;
  finalStr: string;
  posArray: Array<number> = new Array();
  rotArray: Array<number> = new Array();
  depthArray: Array<number> = new Array();

  constructor() {
    this.expansionRule.addRule('F', 'FF+[+F-F]-[+F-F]');
    // this.expansionRule.addRule('X', 'FF+[+F]+[-F]');
    this.compute();
  }

  setIter(iter_in: number) {
    this.iter = iter_in;
  }

  setInitString(str_in: string) {
    this.initStr = str_in;
  }

  compute() {
    // clear before use
    this.finalStr = "";
    this.finalStr = this.expansionRule.process(this.initStr, this.iter);
    console.log(this.finalStr);
    // clean all the arrays first
    this.posArray.length = 0;
    this.rotArray.length = 0;
    this.depthArray.length = 0;
    this.drawingRule.processAndFillArray(this.finalStr, this.posArray, this.rotArray, this.depthArray);
    console.log(this.posArray);
    console.log(this.rotArray);
    console.log(this.depthArray);
  }

}

export default LSystem;