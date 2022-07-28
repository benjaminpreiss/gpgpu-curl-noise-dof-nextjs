
import { useMemo, useRef, useState, useEffect } from 'react'
import { FloatType, RGBAFormat, DataTexture, NearestFilter, Vector3, ShaderMaterial, MathUtils, Scene, OrthographicCamera, NormalBlending } from 'three'
import { useFrame, extend } from '@react-three/fiber'
import { useFBO } from '@react-three/drei'
import dofVertex from '../../shaders/sim-dot/vertex.glsl'
import dofFragment from '../../shaders/sim-dot/fragment.glsl'
import simVertex from '../../shaders/dof-dot/vertex.glsl'
import simFragment from '../../shaders/dof-dot/fragment.glsl'

function getPoint(v:Vector3, size:number, data: Float32Array, offset: number): ArrayLike<number> {
    v.set(Math.random() * 2 - 1, Math.random() * 2 - 1, Math.random() * 2 - 1)
    if (v.length() > 1) return getPoint(v, size, data, offset)
    return v.normalize().multiplyScalar(size).toArray(data, offset)
}

function getSphere(count: number, size: number, p = new Vector3()) {
    const data = new Float32Array(count * 3)
    for (let i = 0; i < count * 3; i += 3) getPoint(p, size, data, i)
    return data
}

export default function Particles({ speed, fov, aperture, focus, curl, size = 512, ...props}: {speed: number, fov: number, aperture: number, focus: number, curl:number, size:number}) {
    const renderRef = useRef<ShaderMaterial>(null)
    const simRef = useRef<ShaderMaterial>(null)

    // Set up FBO
    const [scene] = useState(() => new Scene())
    const [camera] = useState(() => new OrthographicCamera(-1, 1, 1, -1, 1 / Math.pow(2, 53), 1))
    const [positions] = useState(() => new Float32Array([-1, -1, 0, 1, -1, 0, 1, 1, 0, -1, -1, 0, 1, 1, 0, -1, 1, 0]))
    const texture = useMemo(
        () => {
          const t = new DataTexture(getSphere(512 * 512, 128), 512, 512, RGBAFormat, FloatType)
          t.needsUpdate = true
          return t
        },
        []
    );
    const [uvs] = useState(() => new Float32Array([0, 1, 1, 1, 1, 0, 0, 1, 1, 0, 0, 0]))
    const target = useFBO(size, size, { minFilter: NearestFilter, magFilter: NearestFilter, format: RGBAFormat, type: FloatType })
    // Normalize points
    const particles = useMemo(() => {
        const length = size * size
        const particles = new Float32Array(length * 3)
        for (let i = 0; i < length; i++) {
            const i3 = i * 3
            particles[i3 + 0] = (i % size) / size
            particles[i3 + 1] = i / size / size
        }
        return particles
    }, [size])
    // Update FBO and pointcloud every frame
    useFrame((state) => {
        state.gl.setRenderTarget(target)
        state.gl.clear()
        state.gl.render(scene, camera)
        state.gl.setRenderTarget(null)
        if(renderRef?.current && simRef?.current) {
            renderRef.current.uniforms.positions.value = target.texture
            renderRef.current.uniforms.uTime.value = state.clock.elapsedTime
            renderRef.current.uniforms.uFocus.value = MathUtils.lerp(renderRef.current.uniforms.uFocus.value, focus, 0.1)
            renderRef.current.uniforms.uFov.value = MathUtils.lerp(renderRef.current.uniforms.uFov.value, fov, 0.1)
            renderRef.current.uniforms.uBlur.value = MathUtils.lerp(renderRef.current.uniforms.uBlur.value, (5.6 - aperture) * 9, 0.1)
            simRef.current.uniforms.uTime.value = state.clock.elapsedTime * speed
            simRef.current.uniforms.uCurlFreq.value = MathUtils.lerp(simRef.current.uniforms.uCurlFreq.value, curl, 0.1)
        }
    })

    return (
        <>
            {/* Simulation goes into a FBO/Off-buffer */}
            <mesh>
            <shaderMaterial ref={simRef} vertexShader={dofVertex} fragmentShader={dofFragment} uniforms={{
                positions: { value: texture },
                uTime: { value: 0 },
                uCurlFreq: { value: 0.25 }
            }} />
            <bufferGeometry>
                <bufferAttribute attach="attributes-position" count={positions.length / 3} array={positions} itemSize={3} />
                <bufferAttribute attach="attributes-uv" count={uvs.length / 2} array={uvs} itemSize={2} />
            </bufferGeometry>
            </mesh>
            {/* The result of which is forwarded into a pointcloud via data-texture */}
            <points {...props}>
                
            <shaderMaterial ref={renderRef} vertexShader={simVertex} fragmentShader={simFragment} transparent={true} blending={NormalBlending} depthWrite={false} uniforms={{
                positions: { value: null },
                uTime: { value: 0 },
                uFocus: { value: 5.1 },
                uFov: { value: 50 },
                uBlur: { value: 30 }
            }} />
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" count={particles.length / 3} array={particles} itemSize={3} />
                </bufferGeometry>
            </points>
        </>
    )
}