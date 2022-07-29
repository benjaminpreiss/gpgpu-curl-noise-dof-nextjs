import { Canvas } from '@react-three/fiber'
import { OrbitControls, CameraShake } from '@react-three/drei'
import { useControls } from 'leva'
import Particles from '../Particles/Particles'

export default function WebGLSphere() {
	const props = useControls({
		focus: { value: 5.1, min: 3, max: 7, step: 0.01 },
		speed: { value: 100, min: 0.1, max: 100, step: 0.1 },
		aperture: { value: 1.8, min: 1, max: 5.6, step: 0.1 },
		fov: { value: 60, min: 0, max: 200 },
		curl: { value: 0.25, min: 0.01, max: 0.5, step: 0.01 },
		size: 512
	  })
	return (
        <Canvas linear={true} camera={{position: [0,0,6], fov:25}}>
            <OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} zoomSpeed={0.1} />
            <CameraShake yawFrequency={1} maxYaw={0.05} pitchFrequency={1} maxPitch={0.05} rollFrequency={0.5} maxRoll={0.5} intensity={0.2} />
            <Particles {...props} />
        </Canvas>
	)
}
