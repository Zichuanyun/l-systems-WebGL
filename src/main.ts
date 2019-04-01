import {vec3} from 'gl-matrix';
import * as Stats from 'stats-js';
import * as DAT from 'dat-gui';
import Square from './geometry/Square';
import ScreenQuad from './geometry/ScreenQuad';
import LongCube from './geometry/LongCube';
import OpenGLRenderer from './rendering/gl/OpenGLRenderer';
import Camera from './Camera';
import {setGL, cylinderString} from './globals';
import ShaderProgram, {Shader} from './rendering/gl/ShaderProgram';
import LSystem from './lsystem/LSystem'
import Mesh from './geometry/Mesh';

let square: Square;
let screenQuad: ScreenQuad;
let time: number = 0.0;
let lsystem: LSystem = new LSystem();
let longCube: LongCube;
let branchCylinder: Mesh;

function guiChangeCallback() {
  console.log("gui changed!");
  lsystem.setIter(controls['Number of iteration']);

  lsystem.drawingRule.xRot = controls['X axis base rotation'];
  lsystem.drawingRule.xRotRandom = controls['X axis random'];

  lsystem.drawingRule.yRot = controls['Y axis base rotation'];
  lsystem.drawingRule.yRotRandom = controls['Y axis random'];

  lsystem.drawingRule.zRot = controls['Z axis base rotation'];
  lsystem.drawingRule.zRotRandom = controls['Z axis random'];

  lsystem.compute();
  updateBuffer();
}

const controls = {
  'Number of iteration': 3,
  'X axis base rotation': 20,
  'X axis random': 4,
  'Y axis base rotation': 5,
  'Y axis random': 0,
  'Z axis base rotation': 30,
  'Z axis random': 5,
};

function loadScene() {
  square = new Square();
  square.create();
  screenQuad = new ScreenQuad();
  screenQuad.create();
  longCube = new LongCube();
  longCube.create();
  branchCylinder = new Mesh(cylinderString, vec3.fromValues(0, 0, 0));
  branchCylinder.create();
  guiChangeCallback(); // lsystem compute here
  updateBuffer();
}

function updateBuffer() {
  let translates: Float32Array = new Float32Array(lsystem.posArray);
  let rotMats: Float32Array = new Float32Array(lsystem.rotArray);
  let depths: Float32Array = new Float32Array(lsystem.depthArray);
  // longCube.setInstanceVBOs(translates, rotMats, depths);
  // longCube.setNumInstances(depths.length);
  branchCylinder.setInstanceVBOs(translates, rotMats, depths);
  branchCylinder.setNumInstances(depths.length);
}

function main() {
  // Initial display for framerate
  const stats = Stats();
  stats.setMode(0);
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.top = '0px';
  document.body.appendChild(stats.domElement);

  // Add controls to the gui
  const gui = new DAT.GUI();

  gui.add(controls, 'Number of iteration', 1, 4).step(1).onFinishChange(guiChangeCallback);
  gui.add(controls, 'X axis base rotation', 0, 180).step(0.5).onFinishChange(guiChangeCallback);
  gui.add(controls, 'X axis random', 0, 90).step(0.5).onFinishChange(guiChangeCallback);  
  gui.add(controls, 'Y axis base rotation', 0, 180).step(0.5).onFinishChange(guiChangeCallback);
  gui.add(controls, 'Y axis random', 0, 90).step(0.5).onFinishChange(guiChangeCallback);  
  gui.add(controls, 'Z axis base rotation', 0, 180).step(0.5).onFinishChange(guiChangeCallback);
  gui.add(controls, 'Z axis random', 0, 90).step(0.5).onFinishChange(guiChangeCallback);  

  // get canvas and webgl context
  const canvas = <HTMLCanvasElement> document.getElementById('canvas');
  const gl = <WebGL2RenderingContext> canvas.getContext('webgl2');
  if (!gl) {
    alert('WebGL 2 not supported!');
  }
  // `setGL` is a function imported above which sets the value of `gl` in the `globals.ts` module.
  // Later, we can import `gl` from `globals.ts` to access it
  setGL(gl);

  // Initial call to load scene
  loadScene();

  const camera = new Camera(vec3.fromValues(10, 0, 10), vec3.fromValues(0, 0, 0));

  const renderer = new OpenGLRenderer(canvas);
  renderer.setClearColor(0.2, 0.2, 0.2, 1);
  // gl.enable(gl.BLEND);
  // gl.blendFunc(gl.ONE, gl.ONE); // Additive blending
  // gl.enable(gl.CULL_FACE);
  // gl.cullFace(gl.BACK);
  gl.enable(gl.DEPTH_TEST);


  const instancedShader = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/my-instanced-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/instanced-frag.glsl')),
  ]);

  const flat = new ShaderProgram([
    new Shader(gl.VERTEX_SHADER, require('./shaders/flat-vert.glsl')),
    new Shader(gl.FRAGMENT_SHADER, require('./shaders/flat-frag.glsl')),
  ]);

  // This function will be called every frame
  function tick() {
    camera.update();
    // console.log(camera.position);
    // console.log(camera.forward);
    stats.begin();
    instancedShader.setTime(time);
    flat.setTime(time++);
    gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    renderer.clear();
    renderer.render(camera, flat, [screenQuad]);
    renderer.render(camera, instancedShader, [
      branchCylinder,
    ]);
    stats.end();

    // Tell the browser to call `tick` again whenever it renders a new frame
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', function() {
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.setAspectRatio(window.innerWidth / window.innerHeight);
    camera.updateProjectionMatrix();
    // flat.setDimensions(window.innerWidth, window.innerHeight);
  }, false);

  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.setAspectRatio(window.innerWidth / window.innerHeight);
  camera.updateProjectionMatrix();
  // flat.setDimensions(window.innerWidth, window.innerHeight);

  // Start the render loop
  tick();
}

main();
