#version 300 es
precision highp float;

uniform vec3 u_Eye, u_Ref, u_Up;
uniform vec2 u_Dimensions;
uniform float u_Time;

// -1 to 1
in vec2 fs_Pos;
out vec4 out_Col;

float random (in vec2 st) {
    return fract(sin(dot(st.xy,
                         vec2(12.9898,78.233)))
                 * 43758.5453123);
}

// [-1, 1]
vec2 random2(vec2 st){
    st = vec2( dot(st,vec2(127.1,311.7)),
              dot(st,vec2(269.5,183.3)) );
    vec2 result = -1.0 + 2.0*fract(sin(st)*43758.5453123);
    // result = normalize(result);
    return result;
}

float valueNoise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    
    vec2 u = f;
    u = smoothstep(0.0, 1.0, f);
    // return a*(1.0-u.x)*(1.0-u.y) + b*u.x*(1.0-u.y) + c*(1.0-u.x)*u.y + d*u.x*u.y;
    // return random(i);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

float layerValueNoise(int layer, vec2 uv) {
    float col = 0.0;
    for (int i = 0; i < layer; ++i) {
    	vec2 st = uv * pow(2.0, float(i));
        col += valueNoise(st) * pow(0.5, float(i) + 1.0);
    }
    return col;
}

float gradientNoise(vec2 st) {
	vec2 i = floor(st);
    vec2 f = fract(st);
    
    float a = dot(random2(i), f - vec2(0.0, 0.0));
    float b = dot(random2(i + vec2(1.0, 0.0)), f - vec2(1.0, 0.0));
    float c = dot(random2(i + vec2(0.0, 1.0)), f - vec2(0.0, 1.0));
    float d = dot(random2(i + vec2(1.0, 1.0)), f - vec2(1.0, 1.0));
    
    vec2 u = f;
    u = smoothstep(0.0, 1.0, f);
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);   
}

float layerGradientNoise(int layer, vec2 uv) {    
    float col = 0.0;
    for (int i = 0; i < layer; ++i) {
    	vec2 st = uv * pow(2.0, float(i));
        col += gradientNoise(st) * pow(0.5, float(i) + 1.0);
    }
    col = 0.5 + col * 0.5;
    return col;
}

float fbm(vec2 p) {
	return layerValueNoise(5, p);
    // return layerGradientNoise(6, p);
}

float multiFBM(vec2 p) {
	vec2 q = vec2(fbm(p), fbm(p + vec2(5.2,1.3) + 0.3 * vec2(u_Time / 100.0)));
    vec2 r = vec2(fbm(q + p + vec2(4.5, 3.9)), fbm(q + p + vec2(5.2,1.3)));
    
    return fbm(p + r * 4.0 );
}

// void main( out vec4 fragColor, in vec2 fragCoord )
void main()
{
    // Normalized pixel coordinates (from 0 to 1)
    // vec2 uv = fs_Pos / (u_Dimensions.yy / u_Dimensions.xx); 
    vec2 uv = 0.5 * (fs_Pos + vec2(1.0));
    uv = vec2(uv.x, uv.y * (u_Dimensions.y/u_Dimensions.x));

    // Time varying pixel color
    float val = multiFBM(uv * 10.0);
    float r = val;
    float g = 1.0 - val;
    float b = mix(r, g, val);



    vec3 col = mix(vec3(b, g, r), vec3(0.0), val);

    // Output to screen
    out_Col = vec4(col, 1.0);
    // out_Col = vec4(uv, 1.0, 1.0);
    // out_Col = vec4(0.5 * (fs_Pos + vec2(1.0)), 0.0, 1.0);
}