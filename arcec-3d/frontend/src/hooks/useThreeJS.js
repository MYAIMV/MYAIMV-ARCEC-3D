import { useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export const useThreeJS = (canvasRef) => {
  const rendererRef = useRef(null)
  const sceneRef    = useRef(null)
  const cameraRef   = useRef(null)
  const controlsRef = useRef(null)
  const meshRef     = useRef(null)
  const frameRef    = useRef(null)

  useEffect(() => {
    const container = canvasRef.current
    if (!container) return

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf5f5f0)
    sceneRef.current = scene

    const { clientWidth: w, clientHeight: h } = container
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 1000)
    camera.position.set(3, 3, 3)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controlsRef.current = controls

    const axes = new THREE.AxesHelper(2)
    scene.add(axes)

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7)
    scene.add(ambientLight)
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
    dirLight.position.set(5, 8, 5)
    scene.add(dirLight)

    const animar = () => {
      frameRef.current = requestAnimationFrame(animar)
      controls.update()
      renderer.render(scene, camera)
    }
    animar()

    const onResize = () => {
      const { clientWidth: nw, clientHeight: nh } = container
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
    }
    const resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(container)

    return () => {
      cancelAnimationFrame(frameRef.current)
      resizeObserver.disconnect()
      renderer.dispose()
      container.removeChild(renderer.domElement)
    }
  }, [canvasRef])

  const renderizarSuperficie = useCallback((malla, colorHex = '#a8d8d8') => {
    const scene = sceneRef.current
    if (!scene) return

    if (meshRef.current) {
      scene.remove(meshRef.current)
      meshRef.current.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) obj.material.dispose()
      })
      meshRef.current = null
    }

    const { ejeX, ejeY, Z } = malla
    const nx = ejeX.length
    const ny = ejeY.length

    // Clamp de valores extremos (picos de penalización)
    const valoresPlanos = Z.flat().filter(v => Math.abs(v) < 100 && isFinite(v))
    const zMin = valoresPlanos.length ? Math.min(...valoresPlanos) : 0
    const zMax = valoresPlanos.length ? Math.max(...valoresPlanos) : 1
    const zRng = (zMax - zMin) || 1

    const geometry = new THREE.BufferGeometry()
    const vertices = []
    const colores  = []
    const indices  = []
    const colorBase = new THREE.Color(colorHex)

    for (let i = 0; i < ny; i++) {
      for (let j = 0; j < nx; j++) {
        const x = ejeX[j]
        const y = ejeY[i]
        const zRaw = Z[i][j]
        const z = (Math.abs(zRaw) > 100 || !isFinite(zRaw)) ? zMin : zRaw

        vertices.push(x, z, y)

        const t = (z - zMin) / zRng
        const c = colorBase.clone()
        const hsl = {}
        c.getHSL(hsl)
        c.setHSL(hsl.h, hsl.s, Math.min(0.85, 0.25 + t * 0.5))
        colores.push(c.r, c.g, c.b)
      }
    }

    for (let i = 0; i < ny - 1; i++) {
      for (let j = 0; j < nx - 1; j++) {
        const a = i * nx + j
        const b = a + 1
        const c = (i + 1) * nx + j
        const d = c + 1
        indices.push(a, c, b)
        indices.push(b, c, d)
      }
    }

    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    geometry.setAttribute('color',    new THREE.Float32BufferAttribute(colores, 3))
    geometry.setIndex(indices)
    geometry.computeVertexNormals()

    const material = new THREE.MeshPhongMaterial({
      vertexColors: true,
      side: THREE.DoubleSide,
      shininess: 60,
    })

    const wireframe = new THREE.WireframeGeometry(geometry)
    const lineMat = new THREE.LineBasicMaterial({ color: 0xffffff, opacity: 0.15, transparent: true })
    const wire = new THREE.LineSegments(wireframe, lineMat)

    const grupo = new THREE.Group()
    grupo.add(new THREE.Mesh(geometry, material))
    grupo.add(wire)

    const bbox = new THREE.Box3().setFromObject(grupo)
    const centro = bbox.getCenter(new THREE.Vector3())
    grupo.position.sub(centro)

    scene.add(grupo)
    meshRef.current = grupo

    const size = bbox.getSize(new THREE.Vector3()).length()
    cameraRef.current.position.set(size, size * 0.8, size)
    controlsRef.current.target.set(0, 0, 0)
    controlsRef.current.update()
  }, [])

  const resetCamara = useCallback(() => {
    controlsRef.current?.reset()
  }, [])

  const capturarImagen = useCallback(() => {
    return rendererRef.current?.domElement.toDataURL('image/png') || null
  }, [])

  return { renderizarSuperficie, resetCamara, capturarImagen }
}
