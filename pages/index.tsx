import type { NextPage } from 'next'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, CameraShake } from '@react-three/drei'
import { WebGL1Renderer } from 'three'
import { useControls } from 'leva'
import Particles from '../components/Particles/Particles'

const renderer = (canvas: HTMLCanvasElement) => new WebGL1Renderer({
    canvas,
    antialias: true,
    alpha: true
})

const Home: NextPage = () => {
	const props = useControls({
		focus: { value: 5.1, min: 3, max: 7, step: 0.01 },
		speed: { value: 100, min: 0.1, max: 100, step: 0.1 },
		aperture: { value: 1.8, min: 1, max: 5.6, step: 0.1 },
		fov: { value: 60, min: 0, max: 200 },
		curl: { value: 0.25, min: 0.01, max: 0.5, step: 0.01 },
		size: 512
	  })
	return (
		<div className='fixed inset-0 z-10'>
			<Canvas linear={true} camera={{position: [0,0,6], fov:25}} gl={renderer}>
				<OrbitControls makeDefault autoRotate autoRotateSpeed={0.5} zoomSpeed={0.1} />
				<CameraShake yawFrequency={1} maxYaw={0.05} pitchFrequency={1} maxPitch={0.05} rollFrequency={0.5} maxRoll={0.5} intensity={0.2} />
				<Particles {...props} />
			</Canvas>
		</div>
	)
}

export default Home
