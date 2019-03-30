#version 300 es

// begin util funcs =================================================
mat4 constructRotationMat(vec3 r) {
  // init
  vec3 R = radians(r);
  // Z -> Y -> X
  // inverse: X->Y->Z
  return mat4(
    cos(r.z), -sin(r.z), 0.0, 0.0, // 1st col
    sin(r.z), cos(r.z), 0.0, 0.0,  // 2nd col
    0.0, 0.0, 1.0, 0.0,            // 3rd col
    0.0, 0.0, 0.0, 1.0             // 4th col
  ) * mat4(
    cos(r.y), 0.0, sin(r.y), 0.0,  // 1st col
    0.0, 1.0, 0.0, 0.0,            // 2nd col
    -sin(r.y), 0.0, cos(r.y), 0.0, // 3rd col
    0.0, 0.0, 0.0, 1.0             // 4th col
  ) * mat4(
    1.0, 0.0, 0.0, 0.0,            // 1st col
    0.0, cos(r.x), -sin(r.x), 0.0, // 2nd col
    0.0, sin(r.x), cos(r.x), 0.0,  // 3rd col
    0.0, 0.0, 0.0, 1.0             // 4th col
  );
}

mat4 constructTranslationMat(vec3 t) {
  return mat4(
    1.0, 0.0, 0.0, 0.0, // 1st col
    0.0, 1.0, 0.0, 0.0, // 2nd col
    0.0, 0.0, 1.0, 0.0, // 3rd col
    t.x, t.y, t.z, 1.0  // 4th col
  );
}

mat4 constructScaleMat(vec3 s) {
  return mat4(
    s.x, 0.0, 0.0, 0.0,            // 1st col
    0.0, s.y, 0.0, 0.0,            // 2nd col
    0.0, 0.0, s.z, 0.0,            // 3rd col
    0.0, 0.0, 0.0, 1.0             // 4th col
  );
}

mat4 constructTransformationMat(vec3 t, vec3 r, vec3 s) {
  return constructTranslationMat(t) * constructRotationMat(r)
  * constructScaleMat(s);
}
// end util funcs =================================================

uniform mat4 u_ViewProj;
uniform float u_Time;

uniform mat3 u_CameraAxes; // Used for rendering particles as billboards (quads that are always looking at the camera)
// gl_Position = center + vs_Pos.x * camRight + vs_Pos.y * camUp;

in vec4 vs_Pos; // Non-instanced; each particle is the same quad drawn in a different place
in vec3 vs_Translate; // Another instance rendering attribute used to position each quad instance in the scene
in vec3 vs_Forward;
in float vs_Depth;

out vec4 fs_Col;
out vec4 fs_Pos;

void main()
{
    fs_Col = vec4(vec3(vs_Depth * 0.3), 1.0);
    fs_Pos = vs_Pos;

    vec3 billboardPos = vec3(vs_Pos) + vs_Translate;
    gl_Position = u_ViewProj * vec4(billboardPos, 1.0);
    fs_Pos = gl_Position;
}
