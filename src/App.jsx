import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './App.css'

function App() {
  const mountRef = useRef(null)

  useEffect(() => {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 5

    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(window.innerWidth, window.innerHeight)
    renderer.setClearColor(0x000000)
    mountRef.current.appendChild(renderer.domElement)

    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight
      camera.updateProjectionMatrix()
      renderer.setSize(window.innerWidth, window.innerHeight)
    })

    // Création des étoiles
    const starGeometry = new THREE.BufferGeometry()
    const starCount = 1000
    const starVertices = []

    for (let i = 0; i < starCount; i++) {
      const x = (Math.random() - 0.5) * 100
      const y = (Math.random() - 0.5) * 100
      const z = -Math.random() * 100
      starVertices.push(x, y, z)
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3))
    const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.5 })
    const stars = new THREE.Points(starGeometry, starMaterial)
    scene.add(stars)

    // Animation
    const animate = () => {
      requestAnimationFrame(animate)
      stars.rotation.y += 0.0005
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement)
      }
    }
  }, [])

  return (
    <div className="canvas-container" ref={mountRef}>
      <div className="hero-text">HELLO</div>
    </div>
  )
}

export default App
