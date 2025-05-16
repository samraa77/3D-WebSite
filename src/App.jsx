import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import './App.css'
import { useNavigate } from 'react-router-dom'

function App() {
  const mountRef = useRef(null)
  const clickAudioRef = useRef(null)
  const navigate = useNavigate()

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

  const handleStart = () => {
  const audio = clickAudioRef.current
  if (audio) {
    audio.currentTime = 0 // باش يبدأ من الأول ديما
    audio.play().then(() => {
      navigate('/game') // التنقل بعد التشغيل
    }).catch((e) => {
      console.warn('Erreur lecture son bouton:', e)
      navigate('/game') // حتى إلا فشل الصوت، نكملو التنقل
    })
  } else {
    navigate('/game')
  }
}

  return (
    <div className="canvas-container" ref={mountRef}>
      <audio ref={clickAudioRef}>
<source src="/click.wav" type="audio/wav" />
        Your browser does not support the audio element.
      </audio>
      <h1 className="hero-text">HELLO</h1>
      <button className="start-button" onClick={handleStart}>START</button>
    </div>
  )
}

export default App