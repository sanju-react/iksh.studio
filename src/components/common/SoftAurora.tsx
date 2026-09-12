import React, { useEffect, useRef } from 'react';

export interface SoftAuroraProps {
  speed?: number;
  scale?: number;
  brightness?: number;
  color1?: string;
  color2?: string;
  color3?: string;
  noiseFrequency?: number;
  noiseAmplitude?: number;
  bandHeight?: number;
  bandSpread?: number;
  octaveDecay?: number;
  layerOffset?: number;
  colorSpeed?: number;
  enableMouseInteraction?: boolean;
  mouseInfluence?: number;
  className?: string;
  style?: React.CSSProperties;
}

function hexToRgb(hex: string): [number, number, number] {
  const sanitized = hex.replace('#', '').trim();
  if (sanitized.length === 3) {
    const r = parseInt(sanitized[0] + sanitized[0], 16) / 255;
    const g = parseInt(sanitized[1] + sanitized[1], 16) / 255;
    const b = parseInt(sanitized[2] + sanitized[2], 16) / 255;
    return [r, g, b];
  }
  if (sanitized.length === 6) {
    const r = parseInt(sanitized.substring(0, 2), 16) / 255;
    const g = parseInt(sanitized.substring(2, 4), 16) / 255;
    const b = parseInt(sanitized.substring(4, 6), 16) / 255;
    return [r, g, b];
  }
  return [0.18, 0.9, 0.62]; // fallback emerald
}

const VERTEX_SHADER = `#version 300 es
in vec2 aPosition;
out vec2 vUv;
void main() {
  vUv = (aPosition + 1.0) * 0.5;
  gl_Position = vec4(aPosition, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `#version 300 es
precision highp float;

in vec2 vUv;
out vec4 fragColor;

uniform float uTime;
uniform vec2 uResolution;
uniform vec2 uMouse;
uniform float uSpeed;
uniform float uScale;
uniform float uBrightness;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
uniform float uNoiseFreq;
uniform float uNoiseAmp;
uniform float uBandHeight;
uniform float uBandSpread;
uniform float uOctaveDecay;
uniform float uLayerOffset;
uniform float uColorSpeed;
uniform float uMouseInfluence;

// Simplex 2D noise
vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                     -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  
  // Aspect ratio correction
  vec2 p = (uv - 0.5) * vec2(uResolution.x / uResolution.y, 1.0) * uScale;
  
  // Mouse influence
  vec2 mouseOffset = (uMouse - 0.5) * uMouseInfluence;
  p += mouseOffset;

  float t = uTime * uSpeed * 0.35;
  
  // Multi-layered aurora ribbon waves
  float wave1 = snoise(vec2(p.x * uNoiseFreq + t * 0.8, p.y * (uNoiseFreq * 0.5) + t * 0.3)) * uNoiseAmp;
  float wave2 = snoise(vec2(p.x * (uNoiseFreq * 1.6) - t * 0.5, p.y * (uNoiseFreq * 0.8) - t * 0.4)) * (uNoiseAmp * uOctaveDecay);
  float wave3 = snoise(vec2(p.x * (uNoiseFreq * 0.6) + t * 0.2, (p.y + uLayerOffset) * uNoiseFreq + t * 0.6)) * (uNoiseAmp * 0.5);
  
  float totalWave = wave1 + wave2 + wave3;
  
  // Ribbon distribution
  float distToCenter = abs(p.y - totalWave * uBandHeight);
  float auroraGlow = exp(-distToCenter * uBandSpread * 2.5);
  
  // Secondary subtle band
  float dist2 = abs(p.y + 0.35 - (wave2 + wave3) * (uBandHeight * 0.8));
  float auroraGlow2 = exp(-dist2 * (uBandSpread * 2.0)) * 0.6;
  
  float combinedGlow = clamp(auroraGlow + auroraGlow2, 0.0, 1.0) * uBrightness;
  
  // Dynamic color interpolation
  float colorMixer = sin(p.x * 1.5 + t * uColorSpeed) * 0.5 + 0.5;
  vec3 currentAuroraColor = mix(uColor1, uColor2, colorMixer);
  
  // Extra highlight in intense peaks
  currentAuroraColor = mix(currentAuroraColor, uColor3, smoothstep(0.6, 1.0, combinedGlow));
  
  // Soft ambient vignette falloff
  float vignette = smoothstep(1.5, 0.2, length(p * 0.65));
  float alpha = clamp(combinedGlow * vignette, 0.0, 1.0);
  
  fragColor = vec4(currentAuroraColor * alpha, alpha);
}
`;

export const SoftAurora: React.FC<SoftAuroraProps> = ({
  speed = 0.6,
  scale = 1.5,
  brightness = 1.0,
  color1 = '#175443', // Deep Emerald Forest
  color2 = '#2FE69E', // Vibrant Emerald
  color3 = '#D8C39E', // Champagne Gold highlight
  noiseFrequency = 2.5,
  noiseAmplitude = 1.0,
  bandHeight = 0.5,
  bandSpread = 1.0,
  octaveDecay = 0.5,
  layerOffset = 0,
  colorSpeed = 1.0,
  enableMouseInteraction = true,
  mouseInfluence = 0.25,
  className = '',
  style = {},
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef<{ x: number; y: number; targetX: number; targetY: number }>({
    x: 0.5,
    y: 0.5,
    targetX: 0.5,
    targetY: 0.5,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext('webgl2', {
      alpha: true,
      antialias: true,
      premultipliedAlpha: true,
      powerPreference: 'high-performance',
    });

    if (!gl) return;

    // Compile shaders
    const createShader = (type: number, src: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, src);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error(gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };

    const vertShader = createShader(gl.VERTEX_SHADER, VERTEX_SHADER);
    const fragShader = createShader(gl.FRAGMENT_SHADER, FRAGMENT_SHADER);
    if (!vertShader || !fragShader) return;

    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertShader);
    gl.attachShader(program, fragShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error(gl.getProgramInfoLog(program));
      return;
    }

    gl.useProgram(program);

    // Quad geometry
    const positions = new Float32Array([
      -1, -1,
       1, -1,
      -1,  1,
      -1,  1,
       1, -1,
       1,  1,
    ]);

    const vao = gl.createVertexArray();
    gl.bindVertexArray(vao);

    const posBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, posBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

    const aPositionLoc = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPositionLoc);
    gl.vertexAttribPointer(aPositionLoc, 2, gl.FLOAT, false, 0, 0);

    // Uniform locations
    const uTimeLoc = gl.getUniformLocation(program, 'uTime');
    const uResolutionLoc = gl.getUniformLocation(program, 'uResolution');
    const uMouseLoc = gl.getUniformLocation(program, 'uMouse');
    const uSpeedLoc = gl.getUniformLocation(program, 'uSpeed');
    const uScaleLoc = gl.getUniformLocation(program, 'uScale');
    const uBrightnessLoc = gl.getUniformLocation(program, 'uBrightness');
    const uColor1Loc = gl.getUniformLocation(program, 'uColor1');
    const uColor2Loc = gl.getUniformLocation(program, 'uColor2');
    const uColor3Loc = gl.getUniformLocation(program, 'uColor3');
    const uNoiseFreqLoc = gl.getUniformLocation(program, 'uNoiseFreq');
    const uNoiseAmpLoc = gl.getUniformLocation(program, 'uNoiseAmp');
    const uBandHeightLoc = gl.getUniformLocation(program, 'uBandHeight');
    const uBandSpreadLoc = gl.getUniformLocation(program, 'uBandSpread');
    const uOctaveDecayLoc = gl.getUniformLocation(program, 'uOctaveDecay');
    const uLayerOffsetLoc = gl.getUniformLocation(program, 'uLayerOffset');
    const uColorSpeedLoc = gl.getUniformLocation(program, 'uColorSpeed');
    const uMouseInfluenceLoc = gl.getUniformLocation(program, 'uMouseInfluence');

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

    let animationFrameId = 0;
    let startTime = performance.now();

    const handleResize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    const handleMouseMove = (e: MouseEvent) => {
      if (!enableMouseInteraction) return;
      const rect = canvas.getBoundingClientRect();
      if (rect.width && rect.height) {
        mouseRef.current.targetX = (e.clientX - rect.left) / rect.width;
        mouseRef.current.targetY = 1.0 - (e.clientY - rect.top) / rect.height;
      }
    };

    if (enableMouseInteraction) {
      window.addEventListener('mousemove', handleMouseMove);
    }

    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);
    const rgb3 = hexToRgb(color3);

    const render = () => {
      const now = performance.now();
      const elapsed = (now - startTime) / 1000;

      // Smooth mouse lerp
      mouseRef.current.x += (mouseRef.current.targetX - mouseRef.current.x) * 0.05;
      mouseRef.current.y += (mouseRef.current.targetY - mouseRef.current.y) * 0.05;

      gl.useProgram(program);
      gl.bindVertexArray(vao);

      gl.uniform1f(uTimeLoc, elapsed);
      gl.uniform2f(uResolutionLoc, canvas.width, canvas.height);
      gl.uniform2f(uMouseLoc, mouseRef.current.x, mouseRef.current.y);
      gl.uniform1f(uSpeedLoc, speed);
      gl.uniform1f(uScaleLoc, scale);
      gl.uniform1f(uBrightnessLoc, brightness);
      gl.uniform3f(uColor1Loc, rgb1[0], rgb1[1], rgb1[2]);
      gl.uniform3f(uColor2Loc, rgb2[0], rgb2[1], rgb2[2]);
      gl.uniform3f(uColor3Loc, rgb3[0], rgb3[1], rgb3[2]);
      gl.uniform1f(uNoiseFreqLoc, noiseFrequency);
      gl.uniform1f(uNoiseAmpLoc, noiseAmplitude);
      gl.uniform1f(uBandHeightLoc, bandHeight);
      gl.uniform1f(uBandSpreadLoc, bandSpread);
      gl.uniform1f(uOctaveDecayLoc, octaveDecay);
      gl.uniform1f(uLayerOffsetLoc, layerOffset);
      gl.uniform1f(uColorSpeedLoc, colorSpeed);
      gl.uniform1f(uMouseInfluenceLoc, mouseInfluence);

      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 6);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      if (enableMouseInteraction) {
        window.removeEventListener('mousemove', handleMouseMove);
      }
      gl.deleteProgram(program);
      gl.deleteShader(vertShader);
      gl.deleteShader(fragShader);
      gl.deleteBuffer(posBuffer);
      gl.deleteVertexArray(vao);
    };
  }, [
    speed,
    scale,
    brightness,
    color1,
    color2,
    color3,
    noiseFrequency,
    noiseAmplitude,
    bandHeight,
    bandSpread,
    octaveDecay,
    layerOffset,
    colorSpeed,
    enableMouseInteraction,
    mouseInfluence,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full pointer-events-none ${className}`.trim()}
      style={{
        display: 'block',
        position: 'absolute',
        inset: 0,
        ...style,
      }}
    />
  );
};

export default SoftAurora;
