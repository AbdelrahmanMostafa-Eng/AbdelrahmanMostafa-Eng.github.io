"use client"

import { useMemo, useRef, useEffect } from "react"
import { useFrame, useThree } from "@react-three/fiber"
import * as THREE from "three"

const NOISE_GLSL = /* glsl */ `
vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
float snoise(vec3 v){
  const vec2 C=vec2(1.0/6.0,1.0/3.0);
  const vec4 D=vec4(0.0,0.5,1.0,2.0);
  vec3 i=floor(v+dot(v,C.yyy));
  vec3 x0=v-i+dot(i,C.xxx);
  vec3 g=step(x0.yzx,x0.xyz);
  vec3 l=1.0-g;
  vec3 i1=min(g.xyz,l.zxy);
  vec3 i2=max(g.xyz,l.zxy);
  vec3 x1=x0-i1+C.xxx;
  vec3 x2=x0-i2+C.yyy;
  vec3 x3=x0-D.yyy;
  i=mod289(i);
  vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
  float n_=0.142857142857;
  vec3 ns=n_*D.wyz-D.xzx;
  vec4 j=p-49.0*floor(p*ns.z*ns.z);
  vec4 x_=floor(j*ns.z);
  vec4 y_=floor(j-7.0*x_);
  vec4 x=x_*ns.x+ns.yyyy;
  vec4 y=y_*ns.x+ns.yyyy;
  vec4 h=1.0-abs(x)-abs(y);
  vec4 b0=vec4(x.xy,y.xy);
  vec4 b1=vec4(x.zw,y.zw);
  vec4 s0=floor(b0)*2.0+1.0;
  vec4 s1=floor(b1)*2.0+1.0;
  vec4 sh=-step(h,vec4(0.0));
  vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
  vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
  vec3 p0=vec3(a0.xy,h.x);
  vec3 p1=vec3(a0.zw,h.y);
  vec3 p2=vec3(a1.xy,h.z);
  vec3 p3=vec3(a1.zw,h.w);
  vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
  p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
  vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
  m=m*m;
  return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
}
`

const VERTEX = /* glsl */ `
uniform float uTime;
uniform vec3 uMouse;
uniform float uHover;
uniform float uPixelRatio;
uniform float uSize;
attribute float aRandom;
attribute float aShell;
varying float vMix;
varying float vAlpha;
${NOISE_GLSL}
void main(){
  vec3 p = position;
  vec3 n = normalize(position);
  float t = uTime * 0.16;
  float n1 = snoise(p * 1.25 + vec3(t, t * 0.7, -t * 0.4));
  float n2 = snoise(p * 3.4 - vec3(t * 0.6));
  float disp = n1 * 0.22 + n2 * 0.05;
  p += n * disp;

  vec3 toMouse = p - uMouse;
  float d = length(toMouse);
  float influence = smoothstep(1.6, 0.0, d) * uHover;
  p += normalize(toMouse + 0.0001) * influence * 0.6;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);
  gl_Position = projectionMatrix * mv;

  float size = uSize * (0.55 + aRandom * 0.9) * (1.0 + influence * 1.8);
  size *= mix(1.0, 0.7, aShell);
  gl_PointSize = size * uPixelRatio * (4.2 / -mv.z);

  vMix = clamp(disp * 2.2 + 0.45 + influence * 1.2, 0.0, 1.0);
  float depthFade = smoothstep(9.5, 4.0, -mv.z);
  vAlpha = mix(0.32, 0.95, depthFade) * mix(1.0, 0.45, aShell);
}
`

const FRAGMENT = /* glsl */ `
uniform vec3 uColor;
uniform vec3 uColorDim;
uniform float uOpacity;
varying float vMix;
varying float vAlpha;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float r = length(c);
  if (r > 0.5) discard;
  float a = smoothstep(0.5, 0.12, r);
  vec3 col = mix(uColorDim, uColor, vMix);
  gl_FragColor = vec4(col, a * vAlpha * uOpacity);
}
`

function fibonacciSphere(count: number, radius: number, jitter: number, target: Float32Array, offset: number) {
  const golden = Math.PI * (3 - Math.sqrt(5))
  for (let i = 0; i < count; i++) {
    const y = 1 - (i / (count - 1)) * 2
    const r = Math.sqrt(1 - y * y)
    const theta = golden * i
    const jr = radius + (Math.random() - 0.5) * jitter
    const idx = (offset + i) * 3
    target[idx] = Math.cos(theta) * r * jr
    target[idx + 1] = y * jr
    target[idx + 2] = Math.sin(theta) * r * jr
  }
}

type Props = {
  accent: string
  dim: string
  dark: boolean
  count: number
  interactive: boolean
}

export function ParticleObject({ accent, dim, dark, count, interactive }: Props) {
  const group = useRef<THREE.Group>(null)
  const points = useRef<THREE.Points>(null)
  const core = useRef<THREE.Mesh>(null)
  const wire = useRef<THREE.LineSegments>(null)
  const orbitA = useRef<THREE.Group>(null)
  const orbitB = useRef<THREE.Group>(null)
  const satellite = useRef<THREE.Mesh>(null)
  const { size, gl } = useThree()

  const pointer = useRef(new THREE.Vector2(0, 0))
  const pointerActive = useRef(false)
  const hover = useRef(0)
  const targetTilt = useRef(new THREE.Vector2(0, 0))

  const raycaster = useMemo(() => new THREE.Raycaster(), [])
  const plane = useMemo(() => new THREE.Plane(new THREE.Vector3(0, 0, 1), 0), [])
  const worldPoint = useMemo(() => new THREE.Vector3(), [])
  const localPoint = useMemo(() => new THREE.Vector3(), [])

  const geometry = useMemo(() => {
    const shellCount = Math.floor(count * 0.72)
    const haloCount = count - shellCount
    const positions = new Float32Array(count * 3)
    const random = new Float32Array(count)
    const shell = new Float32Array(count)
    fibonacciSphere(shellCount, 1.55, 0.06, positions, 0)
    fibonacciSphere(haloCount, 2.15, 0.5, positions, shellCount)
    for (let i = 0; i < count; i++) {
      random[i] = Math.random()
      shell[i] = i < shellCount ? 0 : 1
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute("position", new THREE.BufferAttribute(positions, 3))
    g.setAttribute("aRandom", new THREE.BufferAttribute(random, 1))
    g.setAttribute("aShell", new THREE.BufferAttribute(shell, 1))
    return g
  }, [count])

  const wireGeometry = useMemo(
    () => new THREE.EdgesGeometry(new THREE.IcosahedronGeometry(0.86, 1)),
    [],
  )

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uMouse: { value: new THREE.Vector3(99, 99, 99) },
      uHover: { value: 0 },
      uPixelRatio: { value: 1 },
      uSize: { value: 2.4 },
      uColor: { value: new THREE.Color(accent) },
      uColorDim: { value: new THREE.Color(dim) },
      uOpacity: { value: 1 },
    }),
    // Colors are updated imperatively below so the geometry is not rebuilt on theme change.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  useEffect(() => {
    uniforms.uColor.value.set(accent)
    uniforms.uColorDim.value.set(dim)
    uniforms.uOpacity.value = dark ? 1 : 0.9
  }, [accent, dim, dark, uniforms])

  useEffect(() => {
    uniforms.uPixelRatio.value = Math.min(gl.getPixelRatio(), 2)
  }, [gl, uniforms])

  useEffect(() => {
    if (!interactive) return
    const canvas = gl.domElement
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1
      pointer.current.set(x, y)
      pointerActive.current = true
      // Tilt is driven by the cursor anywhere on screen, clamped so it stays subtle.
      targetTilt.current.set(
        THREE.MathUtils.clamp(x, -1.8, 1.8),
        THREE.MathUtils.clamp(y, -1.8, 1.8),
      )
    }
    const onLeave = () => {
      pointerActive.current = false
    }
    window.addEventListener("pointermove", onMove, { passive: true })
    window.addEventListener("pointerleave", onLeave)
    window.addEventListener("blur", onLeave)
    return () => {
      window.removeEventListener("pointermove", onMove)
      window.removeEventListener("pointerleave", onLeave)
      window.removeEventListener("blur", onLeave)
    }
  }, [gl, interactive])

  useFrame((state, delta) => {
    const g = group.current
    if (!g) return
    const t = state.clock.elapsedTime
    uniforms.uTime.value = t

    g.rotation.y += delta * 0.12
    g.position.y = Math.sin(t * 0.55) * 0.08

    const tiltX = THREE.MathUtils.lerp(g.rotation.x, -targetTilt.current.y * 0.22 + Math.sin(t * 0.3) * 0.05, 0.04)
    const tiltZ = THREE.MathUtils.lerp(g.rotation.z, targetTilt.current.x * 0.12, 0.04)
    g.rotation.x = tiltX
    g.rotation.z = tiltZ

    if (core.current) {
      core.current.rotation.y -= delta * 0.25
      core.current.rotation.x += delta * 0.1
    }
    if (wire.current) {
      wire.current.rotation.copy(core.current!.rotation)
    }
    if (orbitA.current) {
      orbitA.current.rotation.x = t * 0.34 + targetTilt.current.y * 0.18
      orbitA.current.rotation.y = t * 0.22
    }
    if (orbitB.current) {
      orbitB.current.rotation.z = -t * 0.28 + targetTilt.current.x * 0.18
      orbitB.current.rotation.x = Math.sin(t * 0.32) * 0.28
    }
    if (satellite.current) {
      satellite.current.rotation.x += delta * 0.7
      satellite.current.rotation.y += delta * 0.9
    }

    const wantHover = interactive && pointerActive.current ? 1 : 0
    hover.current = THREE.MathUtils.damp(hover.current, wantHover, 4, delta)
    uniforms.uHover.value = hover.current

    if (interactive && pointerActive.current) {
      raycaster.setFromCamera(pointer.current, state.camera)
      const hit = raycaster.ray.intersectPlane(plane, worldPoint)
      if (hit) {
        localPoint.copy(worldPoint)
        g.worldToLocal(localPoint)
        uniforms.uMouse.value.lerp(localPoint, 0.18)
      }
    }
  })

  const scale = Math.min(1.15, size.width / 460)

  return (
    <group ref={group} scale={scale}>
      <points ref={points} geometry={geometry} frustumCulled={false}>
        <shaderMaterial
          uniforms={uniforms}
          vertexShader={VERTEX}
          fragmentShader={FRAGMENT}
          transparent
          depthWrite={false}
          blending={dark ? THREE.AdditiveBlending : THREE.NormalBlending}
        />
      </points>

      <mesh ref={core}>
        <icosahedronGeometry args={[0.82, 1]} />
        <meshPhysicalMaterial
        color={dark ? "#0b0f0c" : "#d6f5dd"}
        metalness={dark ? 0.75 : 0.2}
        roughness={dark ? 0.28 : 0.4}
        clearcoat={1}
        clearcoatRoughness={0.2}
        flatShading
        emissive={accent}
        emissiveIntensity={dark ? 0.06 : 0.12}
        />
      </mesh>

      <lineSegments ref={wire} geometry={wireGeometry}>
        <lineBasicMaterial color={accent} transparent opacity={dark ? 0.55 : 0.6} />
      </lineSegments>

      <group ref={orbitA} rotation={[0.4, 0.2, 0.2]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.22, 0.012, 8, 96]} />
          <meshBasicMaterial color={accent} transparent opacity={dark ? 0.7 : 0.8} />
        </mesh>
        <mesh position={[1.22, 0, 0]}>
          <icosahedronGeometry args={[0.075, 1]} />
          <meshBasicMaterial color={accent} />
        </mesh>
      </group>

      <group ref={orbitB} rotation={[1.1, 0.2, -0.45]}>
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[1.56, 0.008, 8, 112]} />
          <meshBasicMaterial color={accent} transparent opacity={dark ? 0.32 : 0.48} />
        </mesh>
        <mesh ref={satellite} position={[-1.56, 0, 0]}>
          <octahedronGeometry args={[0.11, 0]} />
          <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={dark ? 2 : 0.5} />
        </mesh>
      </group>
    </group>
  )
}
