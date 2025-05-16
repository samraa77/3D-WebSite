import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { useNavigate } from 'react-router-dom'
import './GamePage.css'

export default function GamePage() {
  const mountRef = useRef(null)
  const navigate = useNavigate()
  const [answered, setAnswered] = useState(false)
  const [showQuestion, setShowQuestion] = useState(true)
  const [answer, setAnswer] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.set(0, 1.5, 5)

    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)
    mountRef.current.appendChild(renderer.domElement)

    const ambientLight = new THREE.AmbientLight(0x404040, 1.5)
    scene.add(ambientLight)

    const spotLight = new THREE.SpotLight(0xffffff, 1)
    spotLight.position.set(0, 5, 5)
    scene.add(spotLight)

    const wallMaterial = new THREE.MeshStandardMaterial({ color: '#444' })
    const floorMaterial = new THREE.MeshStandardMaterial({ color: '#222' })

    const floor = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), floorMaterial)
    floor.rotation.x = -Math.PI / 2
    scene.add(floor)

    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), wallMaterial)
    backWall.position.z = -5
    backWall.position.y = 2.5
    scene.add(backWall)

    const leftWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), wallMaterial)
    leftWall.position.x = -5
    leftWall.position.y = 2.5
    leftWall.rotation.y = Math.PI / 2
    scene.add(leftWall)

    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(10, 5), wallMaterial)
    rightWall.position.x = 5
    rightWall.position.y = 2.5
    rightWall.rotation.y = -Math.PI / 2
    scene.add(rightWall)

    const ceiling = new THREE.Mesh(new THREE.PlaneGeometry(10, 10), floorMaterial)
    ceiling.rotation.x = Math.PI / 2
    ceiling.position.y = 5
    scene.add(ceiling)

    // Door bars
    const barsGroup = new THREE.Group()
    for (let i = -0.9; i <= 0.9; i += 0.2) {
      const bar = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 3, 16),
        new THREE.MeshStandardMaterial({ color: '#111' })
      )
      bar.position.set(i, 1.5, 4.95)
      barsGroup.add(bar)
    }
    scene.add(barsGroup)

    // Bed
    const bed = new THREE.Mesh(
      new THREE.BoxGeometry(2, 0.2, 0.8),
      new THREE.MeshStandardMaterial({ color: '#666' })
    )
    bed.position.set(-2, 0.1, -3)
    scene.add(bed)

    const animate = () => {
      requestAnimationFrame(animate)
      if (answered && barsGroup.rotation.y > -Math.PI / 2) {
        barsGroup.rotation.y -= 0.02
      }
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      if (mountRef.current) {
        mountRef.current.removeChild(renderer.domElement)
      }
    }
  }, [answered])

  const handleSubmit = () => {
    if (answer.trim().toLowerCase() === 'yes') {
      setAnswered(true)
      setShowQuestion(false)
      setTimeout(() => navigate('/'), 4000)
    } else {
      setError('❌ خطأ، جرب مرة أخرى')
    }
  }

  return (
    <div ref={mountRef} className="game-3d-container">
      {showQuestion && (
        <div className="ui-overlay">
          <div className="dungeon-window"></div>
          <h2>باش تهرب من هاد الزنزانة، جاوب:</h2>
          <p>واش <code>&lt;input type="date"&gt;</code> كاين فـ HTML5؟</p>
          <input
            type="text"
            placeholder="yes / no"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
          />
          <button onClick={handleSubmit}>تحقق</button>
          {error && <p className="error-msg">{error}</p>}
        </div>
      )}
    </div>
  )
}
