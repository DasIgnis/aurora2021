---
name: fire
type: fragment
author: Richard Davey
uniform.width: { "type": "1f", "value": "0.0" }
uniform.height: { "type": "1f", "value": "0.0" }
uniform.left: { "type": "1f", "value": "0.0" }
uniform.top: { "type": "1f", "value": "0.0" }
uniform.alpha: { "type": "1f", "value": "0.0" }
uniform.beta: { "type": "1f", "value": "0.0" }
---

precision mediump float;

uniform float time;
uniform vec2 mouse;
uniform vec2 resolution;
uniform float width;
uniform float height;
uniform float left;
uniform float top;
uniform float alpha;
uniform float beta;

uniform float size;

vec2 wave(vec2 p) {
    float x = sin( 3.0*p.y + 15.0*p.x + 3.0*time) * 0.05;
    float y = sin( 3.0*p.y + 15.0*p.x + 3.0*time) * 0.05;
    return vec2(p.x + x, p.y + y);
}

float rand(float co)
{
    return fract(sin(dot(vec2(co, co) ,vec2(12.9898,78.233))) * 43758.5453);
}

void main( void ) {
    //vec2 position = ( (gl_FragCoord.xy) / (vec2(width, height)) )  - vec2(left / resolution.x, (-top + height) / resolution.y);
    vec2 position = vec2(gl_FragCoord.x, height - gl_FragCoord.y) / vec2(width, height) - vec2(left / width, -top / height);
    vec2 uv = wave( gl_FragCoord.xy / resolution.xy ); 

    float a = uv.y + rand(gl_FragCoord.y) * 10.0 + uv.x / 5.0;
    float blue_intents = abs(sin(a * 10.0) * 0.6);

    float dist = distance(position.x, 0.0);
    float xOpacity = (1.0 - abs(0.5 - position.x)) * 0.5;
    float yOpacity = (1.0 - abs(0.5 - position.y)) * 0.5;

    float opacity = (xOpacity + yOpacity) * alpha + beta;

    //gl_FragColor = vec4(opacity, 0.0, 0.0,  1.0);
    gl_FragColor = vec4(blue_intents / 1.5, blue_intents / 1.5, blue_intents, 0.6) * opacity;
}