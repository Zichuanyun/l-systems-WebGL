import Turtle from './Turtle';
import ExpansionRule from './ExpansionRule';
import DrawingRule from './DrawingRule';
import {vec3} from 'gl-matrix';

// arrays to store sacle, pos, rot
class LSystem {
  expansionRule: ExpansionRule = new ExpansionRule();
  drawingRule: DrawingRule = new DrawingRule();
  initStr: string = 'F-F-F';
  finalStr: string;
  iter: number = 3;
  constructor(str_in: string, iter_in: number) {
    this.iter = iter_in;
    this.initStr = str_in;
    this.expansionRule.addRule('F', '[X]');
    this.expansionRule.addRule('X', 'F-F');
    this.compute();
  }

  setIter(iter_in: number) {
    this.iter = iter_in;
  }

  setInitString(str_in: string) {
    this.initStr = str_in;
  }

  compute() {
    this.finalStr = this.expansionRule.process(this.initStr, this.iter);
    console.log(this.finalStr);
    // this shuold modify the arrays
    let posArray: Array<number> = new Array();
    let rotArray: Array<number> = new Array();
    let scaleArray: Array<number> = new Array();
    this.drawingRule.processAndFillArray('[1F2F3]F[3F2F1]', posArray, rotArray, scaleArray);
    console.log(posArray);
    console.log(rotArray);
    console.log(scaleArray);
  }

}

export default LSystem;