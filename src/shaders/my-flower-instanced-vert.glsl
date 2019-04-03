#version 300 es
#define TAPER_FACTOR 0.5

// begin util funcs =================================================
mat4 constructRotationMat(vec4 quat) {
    float i = quat.x;
    float j = quat.y;
    float k = quat.z;
    float r = quat.w;
    return mat4(
        1.0 - 2.0*(j*j + k*k), 2.0*(i*j + k*r), 2.0*(i*k - j*r), 0.0, // 1st col
        2.0*(i*j - k*r), 1.0 - 2.0*(i*i + k*k), 2.0*(j*k + i*r), 0.0, // 2nd col
        2.0*(i*k + j*r), 2.0*(j*k - i*r), 1.0 - 2.0*(i*i + j*j), 0.0, // 3rd col
        0.0, 0.0, 0.0, 1.0                                            // 4th col
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

mat4 constructTransformationMat(vec3 t, vec4 quat, vec3 s) {
  return constructTranslationMat(t) * constructRotationMat(quat)
  * constructScaleMat(s);
}
// end util funcs =================================================

uniform mat4 u_ViewProj;
uniform float u_Time;
uniform mat3 u_CameraAxes; // Used for rendering particles as billboards (quads that are always looking at the camera)

in vec4 vs_Pos; // Non-instanced; each particle is the same quad drawn in a different place
in vec3 vs_Translate; // Another instance rendering attribute used to position each quad instance in the scene
in float vs_Depth;
in vec4 vs_RotQuat;
in vec4 vs_Normal;

out vec4 fs_Col;
out vec4 fs_Pos;
out vec4 fs_Normal;

void main()
{
    fs_Col = vec4(1.0, vs_Depth * 0.2, 1.0, 1.0);
    mat4 transformMat = constructTransformationMat(
        vs_Translate,
        vs_RotQuat,
        vec3(0.0007)
    );
    vec4 worldPos = transformMat * vs_Pos;
    fs_Normal = transformMat * vs_Normal;
    fs_Normal = vs_Normal;
    gl_Position = u_ViewProj * worldPos;
    fs_Pos = gl_Position;
}
