import {vec3} from 'gl-matrix';


class Turtle {
  pos: vec3 = vec3.create();
  orient: vec3 = vec3.create();
  depth: number = 0;

  constructor(position: vec3, orientation:vec3, depth_: number) {
    this.pos = position;
    this.orient = orientation;
    this.depth = depth_;
  }

}

export default Turtle;