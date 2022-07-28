import { extend } from '@react-three/fiber'
import { ShaderMaterial, NormalBlending } from 'three'
import dofVertex from '../shaders/dof-dot/vertex.glsl'
import dofFragment from '../shaders/dof-dot/fragment.glsl'

class DofPointsMaterial extends ShaderMaterial {
  constructor() {
    super({
      vertexShader: dofVertex,
      fragmentShader: dofFragment,
      uniforms: {
        positions: { value: null },
        uTime: { value: 0 },
        uFocus: { value: 5.1 },
        uFov: { value: 50 },
        uBlur: { value: 30 }
      },
      transparent: true,
      blending: NormalBlending,
      depthWrite: false
    })
  }
}

extend({ DofPointsMaterial })
