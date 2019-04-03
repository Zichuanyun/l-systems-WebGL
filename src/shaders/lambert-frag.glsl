#version 300 es
precision highp float;

in vec4 fs_Col;
in vec4 fs_Pos;

in vec4 fs_Normal;
out vec4 out_Col;

vec3 lightPos = vec3(10.0);

void main()
{
    float dist = 1.0 - (length(fs_Pos.xyz) * 2.0);
    vec3 norCol = (vec3(fs_Normal) + vec3(1.0)) * 0.5;
    out_Col = vec4(norCol, 1.0);
    vec3 lightDir = normalize(lightPos - vec3(fs_Pos));
    float NdotL = max(dot(lightDir, vec3(fs_Normal)), 0.0);
    float diffuse = max(0.2, NdotL);
    out_Col = vec4(mix(vec3(diffuse), norCol, diffuse), 1.0);
}
