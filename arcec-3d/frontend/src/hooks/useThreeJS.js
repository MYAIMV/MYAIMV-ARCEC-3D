import { useEffect, useRef, useCallback, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { CSS2DRenderer, CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer.js'

const NUM_MARCAS = 5

// Paleta de colores distintos, generados automáticamente por índice (uno por expresión)
export const colorPorIndice = (i, total) => {
  const hue = (i * (360 / Math.max(total, 1))) % 360
  return new THREE.Color(`hsl(${hue}, 65%, 55%)`).getHexString()
}

const formatearNumero = (v) => {
  if (Math.abs(v) >= 1000 || (Math.abs(v) < 0.01 && v !== 0)) return v.toExponential(1)
  return Number(v.toFixed(2)).toString()
}

const crearEtiqueta = (texto, { tamano = '11px', color = '#555', bold = false } = {}) => {
  const div = document.createElement('div')
  div.textContent = texto
  div.style.fontSize = tamano
  div.style.color = color
  div.style.fontFamily = 'system-ui, sans-serif'
  div.style.fontWeight = bold ? '700' : '400'
  div.style.whiteSpace = 'nowrap'
  div.style.userSelect = 'none'
  div.style.pointerEvents = 'none'
  if (bold) {
    div.style.background = 'rgba(255,255,255,0.85)'
    div.style.padding = '1px 5px'
    div.style.borderRadius = '4px'
  }
  return new CSS2DObject(div)
}

export const useThreeJS = (canvasRef) => {
  const rendererRef      = useRef(null)
  const labelRendererRef = useRef(null)
  const sceneRef         = useRef(null)
  const cameraRef        = useRef(null)
  const controlsRef      = useRef(null)
  const mallasGroupRef   = useRef(null)
  const ejesRef          = useRef(null)
  const frameRef         = useRef(null)
  const [modoVista, setModoVistaState] = useState('3d')

  useEffect(() => {
    const container = canvasRef.current
    if (!container) return
    container.style.position = 'relative'

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xf5f5f0)
    sceneRef.current = scene

    const { clientWidth: w, clientHeight: h } = container
    const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 2000)
    camera.position.set(3, 3, 3)
    cameraRef.current = camera

    const renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true })
    renderer.setSize(w, h)
    renderer.setPixelRatio(window.devicePixelRatio)
    container.appendChild(renderer.domElement)
    rendererRef.current = renderer

    const labelRenderer = new CSS2DRenderer()
    labelRenderer.setSize(w, h)
    labelRenderer.domElement.style.position = 'absolute'
    labelRenderer.domElement.style.top = '0px'
    labelRenderer.domElement.style.left = '0px'
    labelRenderer.domElement.style.pointerEvents = 'none'
    container.appendChild(labelRenderer.domElement)
    labelRendererRef.current = labelRenderer

    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controlsRef.current = controls

    scene.add(new THREE.AmbientLight(0xffffff, 0.7))
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8)
    dirLight.position.set(5, 8, 5)
    scene.add(dirLight)

    const animar = () => {
      frameRef.current = requestAnimationFrame(animar)
      controls.update()
      renderer.render(scene, camera)
      labelRenderer.render(scene, camera)
    }
    animar()

    const onResize = () => {
      const { clientWidth: nw, clientHeight: nh } = container
      camera.aspect = nw / nh
      camera.updateProjectionMatrix()
      renderer.setSize(nw, nh)
      labelRenderer.setSize(nw, nh)
    }
    const resizeObserver = new ResizeObserver(onResize)
    resizeObserver.observe(container)

    return () => {
      cancelAnimationFrame(frameRef.current)
      resizeObserver.disconnect()
      renderer.dispose()
      container.removeChild(renderer.domElement)
      container.removeChild(labelRenderer.domElement)
    }
  }, [canvasRef])

  const construirEjes = useCallback((bbox, ejeXReal, ejeYReal, zMin, zMax, nombreVarX, nombreVarY) => {
    const grupo = new THREE.Group()
    const { min, max } = bbox

    const cajaGeo = new THREE.BoxGeometry(max.x - min.x, max.y - min.y, max.z - min.z)
    const cajaEdges = new THREE.EdgesGeometry(cajaGeo)
    const caja = new THREE.LineSegments(cajaEdges, new THREE.LineBasicMaterial({ color: 0x999999, opacity: 0.5, transparent: true }))
    caja.position.set((min.x + max.x) / 2, (min.y + max.y) / 2, (min.z + max.z) / 2)
    grupo.add(caja)

    const tamanoGrid = Math.max(max.x - min.x, max.z - min.z) || 1
    const grid = new THREE.GridHelper(tamanoGrid, NUM_MARCAS * 2, 0xcfcfcf, 0xe8e8e8)
    grid.position.set((min.x + max.x) / 2, min.y, (min.z + max.z) / 2)
    grupo.add(grid)

    for (let i = 0; i < NUM_MARCAS; i++) {
      const t = i / (NUM_MARCAS - 1)
      const xPos = min.x + t * (max.x - min.x)
      const valorReal = ejeXReal[0] + t * (ejeXReal[1] - ejeXReal[0])
      const etiqueta = crearEtiqueta(formatearNumero(valorReal))
      etiqueta.position.set(xPos, min.y, min.z)
      grupo.add(etiqueta)
    }
    const nombreX = crearEtiqueta(nombreVarX, { bold: true, color: '#2c4a63' })
    nombreX.position.set(max.x + (max.x - min.x) * 0.08, min.y, min.z)
    grupo.add(nombreX)

    for (let i = 0; i < NUM_MARCAS; i++) {
      const t = i / (NUM_MARCAS - 1)
      const zPos = min.z + t * (max.z - min.z)
      const valorReal = ejeYReal[0] + t * (ejeYReal[1] - ejeYReal[0])
      const etiqueta = crearEtiqueta(formatearNumero(valorReal))
      etiqueta.position.set(min.x, min.y, zPos)
      grupo.add(etiqueta)
    }
    const nombreY = crearEtiqueta(nombreVarY, { bold: true, color: '#2c4a63' })
    nombreY.position.set(min.x, min.y, max.z + (max.z - min.z) * 0.08)
    grupo.add(nombreY)

    for (let i = 0; i < NUM_MARCAS; i++) {
      const t = i / (NUM_MARCAS - 1)
      const yPos = min.y + t * (max.y - min.y)
      const valorReal = zMin + t * (zMax - zMin)
      const etiqueta = crearEtiqueta(formatearNumero(valorReal))
      etiqueta.position.set(min.x, yPos, min.z)
      grupo.add(etiqueta)
    }
    const nombreZ = crearEtiqueta('Salida', { bold: true, color: '#4a6741' })
    nombreZ.position.set(min.x, max.y + (max.y - min.y) * 0.08, min.z)
    grupo.add(nombreZ)

    return grupo
  }, [])

  const construirMallaMesh = (malla, colorHex, zMinGlobal, zMaxGlobal) => {
    const { ejeX, ejeY, Z } = malla
    const nx = ejeX.length
    const ny = ejeY.length
    const zRng = (zMaxGlobal - zMinGlobal) || 1

    const geometry = new THREE.BufferGeometry()
    const vertices = []
    const colores = []
    const indices = []
    const colorBase = new THREE.Color('#' + colorHex)

    for (let i = 0; i < ny; i++) {
      for (let j = 0; j < nx; j++) {
        const x = ejeX[j]
        const y = ejeY[i]
        const zRaw = Z[i][j]
        const z = (Math.abs(zRaw) > 100 || !isFinite(zRaw)) ? zMinGlobal : zRaw
        vertices.push(x, z, y)

        const t = (z - zMinGlobal) / zRng
        const c = colorBase.clone()
        const hsl = {}
        c.getHSL(hsl)
        c.setHSL(hsl.h, hsl.s, Math.min(0.85, 0.3 + t * 0.4))
        colores.push(c.r, c.g, c.b)
      }
    }
    for (let i = 0; i < ny - 1; i++) {
      for (let j = 0; j < nx - 1; j++) {
        const a = i * nx + j, b = a + 1, c = (i + 1) * nx + j, d = c + 1
        indices.push(a, c, b); indices.push(b, c, d)
      }
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3))
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colores, 3))
    geometry.setIndex(indices)
    geometry.computeVertexNormals()

    const material = new THREE.MeshPhongMaterial({
      vertexColors: true, side: THREE.DoubleSide, shininess: 50,
      transparent: true, opacity: 0.88
    })
    return new THREE.Mesh(geometry, material)
  }

  // ── Renderiza TODAS las superficies dadas, superpuestas en la misma escena ──
  // superficies: [{ expresion, malla: {ejeX, ejeY, Z, varX, varY}, color }]
  const renderizarSuperficies = useCallback((superficies) => {
    const scene = sceneRef.current
    if (!scene || superficies.length === 0) return

    if (mallasGroupRef.current) {
      scene.remove(mallasGroupRef.current)
      mallasGroupRef.current.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) obj.material.dispose()
      })
      mallasGroupRef.current = null
    }
    if (ejesRef.current) {
      scene.remove(ejesRef.current)
      ejesRef.current.traverse(obj => {
        if (obj.geometry) obj.geometry.dispose()
        if (obj.material) obj.material.dispose()
        if (obj.element) obj.element.remove()
      })
      ejesRef.current = null
    }

    // Rango Z global (combinando todas las superficies) para que el color y la
    // escala vertical sean consistentes entre todas las superpuestas.
    const todosLosZ = superficies.flatMap(s => s.malla.Z.flat()).filter(v => Math.abs(v) < 100 && isFinite(v))
    const zMin = todosLosZ.length ? Math.min(...todosLosZ) : 0
    const zMax = todosLosZ.length ? Math.max(...todosLosZ) : 1

    const grupoMallas = new THREE.Group()
    superficies.forEach(({ malla, color }) => {
      const mesh = construirMallaMesh(malla, color, zMin, zMax)
      grupoMallas.add(mesh)
    })
    scene.add(grupoMallas)
    mallasGroupRef.current = grupoMallas

    const primera = superficies[0].malla
    const bbox = new THREE.Box3().setFromObject(grupoMallas)
    const ejes = construirEjes(
      bbox,
      [primera.ejeX[0], primera.ejeX[primera.ejeX.length - 1]],
      [primera.ejeY[0], primera.ejeY[primera.ejeY.length - 1]],
      zMin, zMax,
      primera.varX || 'X', primera.varY || 'Y'
    )
    scene.add(ejes)
    ejesRef.current = ejes

    const centro = bbox.getCenter(new THREE.Vector3())
    const size = bbox.getSize(new THREE.Vector3()).length()
    controlsRef.current.target.copy(centro)

    if (modoVista === '2d') {
      cameraRef.current.position.set(centro.x + 0.0001, centro.y + size, centro.z + 0.0001)
    } else {
      cameraRef.current.position.set(centro.x + size * 0.7, centro.y + size * 0.6, centro.z + size * 0.7)
    }
    controlsRef.current.update()
  }, [modoVista, construirEjes])

  const resetCamara = useCallback(() => {
    const controls = controlsRef.current
    const camera = cameraRef.current
    if (!controls || !camera || !mallasGroupRef.current) { controls?.reset(); return }
    const bbox = new THREE.Box3().setFromObject(mallasGroupRef.current)
    const centro = bbox.getCenter(new THREE.Vector3())
    const size = bbox.getSize(new THREE.Vector3()).length()
    controls.target.copy(centro)
    if (modoVista === '2d') camera.position.set(centro.x + 0.0001, centro.y + size, centro.z + 0.0001)
    else camera.position.set(centro.x + size * 0.7, centro.y + size * 0.6, centro.z + size * 0.7)
    controls.update()
  }, [modoVista])

  const setModoVista = useCallback((modo) => {
    const controls = controlsRef.current
    const camera = cameraRef.current
    if (!controls || !camera) return
    setModoVistaState(modo)
    const centro = controls.target.clone()
    const distancia = new THREE.Vector3().copy(camera.position).sub(centro).length() || 5
    if (modo === '2d') {
      controls.minPolarAngle = 0.001
      controls.maxPolarAngle = 0.001
      camera.position.set(centro.x + 0.0001, centro.y + distancia, centro.z + 0.0001)
    } else {
      controls.minPolarAngle = 0
      controls.maxPolarAngle = Math.PI
      camera.position.set(centro.x + distancia * 0.7, centro.y + distancia * 0.6, centro.z + distancia * 0.7)
    }
    controls.update()
  }, [])

  const girarHorizontal = useCallback((gradosDelta) => {
    const controls = controlsRef.current, camera = cameraRef.current
    if (!controls || !camera || modoVista === '2d') return
    const offset = new THREE.Vector3().copy(camera.position).sub(controls.target)
    const spherical = new THREE.Spherical().setFromVector3(offset)
    spherical.theta += THREE.MathUtils.degToRad(gradosDelta)
    offset.setFromSpherical(spherical)
    camera.position.copy(controls.target).add(offset)
    camera.lookAt(controls.target)
    controls.update()
  }, [modoVista])

  const girarVertical = useCallback((gradosDelta) => {
    const controls = controlsRef.current, camera = cameraRef.current
    if (!controls || !camera || modoVista === '2d') return
    const offset = new THREE.Vector3().copy(camera.position).sub(controls.target)
    const spherical = new THREE.Spherical().setFromVector3(offset)
    spherical.phi = THREE.MathUtils.clamp(spherical.phi + THREE.MathUtils.degToRad(gradosDelta), 0.05, Math.PI - 0.05)
    offset.setFromSpherical(spherical)
    camera.position.copy(controls.target).add(offset)
    camera.lookAt(controls.target)
    controls.update()
  }, [modoVista])

  const aplicarZoom = useCallback((factor) => {
    const controls = controlsRef.current, camera = cameraRef.current
    if (!controls || !camera) return
    const offset = new THREE.Vector3().copy(camera.position).sub(controls.target)
    offset.multiplyScalar(factor)
    camera.position.copy(controls.target).add(offset)
    controls.update()
  }, [])

  const capturarImagen = useCallback((formato = 'png') => {
    return rendererRef.current?.domElement.toDataURL(`image/${formato}`) || null
  }, [])

  const obtenerDimensionesCanvas = useCallback(() => {
    const el = rendererRef.current?.domElement
    return el ? { width: el.width, height: el.height } : { width: 800, height: 600 }
  }, [])

  return {
    renderizarSuperficies, resetCamara, capturarImagen, obtenerDimensionesCanvas,
    setModoVista, modoVista, girarHorizontal, girarVertical, aplicarZoom
  }
}