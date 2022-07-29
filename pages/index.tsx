import type { NextPage } from 'next'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, CameraShake } from '@react-three/drei'
import { useControls } from 'leva'
import Particles from '../components/Particles/Particles'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const DynamicWebGLSphere = dynamic(() => import('../components/WebGLSphere/WebGLSphere'), {
	suspense: false,
	ssr: false
  })

const Home: NextPage = () => {
	return (
		<div className='fixed inset-0 z-10 bg-black'>
			<Suspense fallback={null}>
				<DynamicWebGLSphere />
			</Suspense>
		</div>
	)
}

export default Home
