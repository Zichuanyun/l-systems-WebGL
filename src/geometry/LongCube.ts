import {vec3, vec4} from 'gl-matrix';
import Drawable from '../rendering/gl/Drawable';
import {gl} from '../globals';

class LongCube extends Drawable {
  indices: Uint32Array;
  positions: Float32Array;
  colors: Float32Array;
  offsets: Float32Array; // Data for bufTranslate
  translates: Float32Array;
  forwards: Float32Array;
  depths: Float32Array;


  constructor() {
    super(); // Call the constructor of the super class. This is required.
  }

  create() {

  this.indices = new Uint32Array([0, 1, 2,
                                  2, 1, 3,

                                  2, 3, 4,
                                  4, 3, 5,

                                  4, 5, 6,
                                  6, 5, 7,

                                  6, 7, 0,
                                  0, 7, 1,

                                  1, 7, 3,
                                  3, 7, 5,

                                  6, 0, 4,
                                  4, 0, 2]);

                                     // HERE
    this.positions = new Float32Array([-0.5, 0, 0.5, 1,
                                       0.5, 0, 0.5, 1,
                                       -0.5, 2, 0.5, 1,
                                       0.5, 2, 0.5, 1,

                                       -0.5, 2, -0.5, 1,
                                       0.5, 2, -0.5, 1,
                                       -0.5, 0, -0.5, 1,
                                       0.5, 0, -0.5, 1]);

    this.generateIdx();
    this.generatePos();
    // this.generateCol();
    this.generateTranslate();
    this.generateForward();
    this.generateDepth();

    this.count = this.indices.length;
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.bufIdx);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufPos);
    gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);

    console.log(`Created square`);
  }

  setInstanceVBOs(offsets: Float32Array, colors: Float32Array) {
    this.colors = colors;
    this.offsets = offsets;

    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufCol);
    gl.bufferData(gl.ARRAY_BUFFER, this.colors, gl.STATIC_DRAW);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTranslate);
    gl.bufferData(gl.ARRAY_BUFFER, this.offsets, gl.STATIC_DRAW);
  }

  setInstanceVBOsNew(translates: Float32Array, forwards: Float32Array, depths: Float32Array) {
    this.translates = translates;
    this.forwards = forwards;
    this.depths = depths;

    // translation
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufTranslate);
    gl.bufferData(gl.ARRAY_BUFFER, this.translates, gl.STATIC_DRAW);
    // forward orientation
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufForward);
    gl.bufferData(gl.ARRAY_BUFFER, this.forwards, gl.STATIC_DRAW);
    // recursion depth
    gl.bindBuffer(gl.ARRAY_BUFFER, this.bufDepth);
    gl.bufferData(gl.ARRAY_BUFFER, this.depths, gl.STATIC_DRAW);
  }
};

export default LongCube;
