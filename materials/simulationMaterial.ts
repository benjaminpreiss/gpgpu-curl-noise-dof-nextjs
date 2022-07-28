import { extend } from '@react-three/fiber'
import { Vector4, ShaderMaterial, DataTexture, RGBAFormat, FloatType } from 'three'
import simVertex from '../shaders/sim-dot/vertex.glsl'
import simFragment from '../shaders/sim-dot/fragment.glsl'

function getPoint(v:Vector4, size:number, data: Float32Array, offset: number): ArrayLike<number> {
    v.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1, 0)
    if (v.length() > 1) return getPoint(v, size, data, offset)
    return v.normalize().multiplyScalar(size).toArray(data, offset)
}

function getSphere(count:number, size:number, p = new Vector4()) {
  const data = new Float32Array(count * 4)
  for (let i = 0; i < count * 4; i += 4) getPoint(p, size, data, i)
  return data
}

class SimulationMaterial extends ShaderMaterial {
  constructor() {
    const positionsTexture = new DataTexture(getSphere(512 * 512, 128), 512, 512, RGBAFormat, FloatType)
    positionsTexture.needsUpdate = true

    super({
      vertexShader: simVertex,
      fragmentShader: simFragment,
      uniforms: {
        positions: { value: positionsTexture },
        uTime: { value: 0 },
        uCurlFreq: { value: 0.25 }
      }
    })
  }
}

extend({ SimulationMaterial })
