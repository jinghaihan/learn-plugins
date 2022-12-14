import $, { param } from 'jquery'
import _ from 'lodash'
import * as THREE from 'three'
import { RGBELoader } from 'three/examples/jsm/loaders/RGBELoader'
// 导入控制器，轨道控制器
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// 导入模型解析器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
// 性能监控/功能面板
import * as Stats from 'stats.js'
import * as Dat from 'dat.gui'

class Base3D {
  constructor (container, option) {
    this.container = container
    this.option = option || {}
    this.observer = null
    this.model = []
    this.intersect = null
    
    this.camera = null
    this.scene = null
    this.renderer = null
    this.controls = null
    this.progressFn = null
    this.clock = new THREE.Clock()
    this.raycaster = new THREE.Raycaster()
    this.mouse = new THREE.Vector2()
    this.stats = null
    this.gui = null

    this.init()
    this.animate()
    this.listener()
    this.tick()
  }
  onProgress (fn) {
    this.progressFn = fn
  }
  init () {
    // 初始化场景
    this.initScene()
    // 初始化相机
    this.initCamera()
    // 初始化渲染器
    this.initRenderer()
    // 初始化控制器
    this.initControls()
    // 初始化性能监控面板
    this.initStats()
    // 初始化Gui
    this.initGui()
    // 添加物体
    this.addMesh()
  }
  initScene () {
    this.scene = new THREE.Scene()
    const scene = this.option.scene || {}
    switch (scene.type) {
      case 'hdr':
        this.setHdrScene(this.option.scene.name)
        break
      case 'cube-vr':
        this.setCubeVrScene('cube', this.option.scene)
        break
      case 'sphere-vr':
        this.setSphereVrScene('sphere', this.option.scene)
        break
      default:
        break
    }
  }
  setHdrScene (hdr) {
    new RGBELoader().setPath('./files/hdr/').load(hdr + '.hdr', (texture) => {
      texture.mapping = THREE.EquirectangularReflectionMapping
      this.scene.background = texture
      this.scene.environment = texture
    })
  }
  setCubeVrScene (type, option) {
    const textures = []
    for (let i = 0; i < 6; i++) {
      textures[i] = new THREE.Texture()
    }
    new THREE.ImageLoader()
      .load('./files/texture/' + option.name, (image) => {
        let canvas, context
        const tileWidth = image.height
        for (let i = 0; i < textures.length; i++) {
          canvas = document.createElement('canvas')
          context = canvas.getContext('2d')
          canvas.height = tileWidth
          canvas.width = tileWidth
          context.drawImage(image, tileWidth * i, 0, tileWidth, tileWidth, 0, 0, tileWidth, tileWidth)
          textures[i].image = canvas
          textures[i].needsUpdate = true
        }
      })
    const materials = []
    for (let i = 0; i < 6; i++) {
      materials.push(new THREE.MeshBasicMaterial({ map: textures[i] }))
    }
    const skyBox = new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1), materials)
    skyBox.geometry.scale(1, 1, -1)
    this.scene.add(skyBox)
  }
  setSphereVrScene (type, option) {
    const geometry = new THREE.SphereGeometry(500, 60, 40)
    geometry.scale(-1, 1, 1)
    const texture = new THREE.TextureLoader().load('./files/texture/' + option.name)
    const material = new THREE.MeshBasicMaterial({ map: texture })
    const mesh = new THREE.Mesh(geometry, material)
    this.scene.add(mesh)
  }
  initCamera () {
    const scene = this.option.scene || {}
    switch (scene.type) {
      case 'hdr':
        this.camera = new THREE.PerspectiveCamera(
          45,
          this.container.offsetWidth / this.container.offsetHeight,
          0.25,
          200
        )
        this.camera.position.set(-1.8, 0.6, 2.7)
        break
      case 'cube-vr':
        this.camera = new THREE.PerspectiveCamera(
          90,
          this.container.offsetWidth / this.container.offsetHeight,
          0.25,
          200
        )
        this.camera.position.z = 0.01
        break
      case 'sphere-vr':
        this.camera = new THREE.PerspectiveCamera(
          75,
          this.container.offsetWidth / this.container.offsetHeight,
          1,
          1100 
        )
        this.camera.position.z = 0.01
        break
      default:
        break
    }
  }
  initRenderer () {
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    // 设置屏幕像素比
    this.renderer.setPixelRatio(window.devicePixelRatio)
    // 渲染的尺寸大小
    this.renderer.setSize(this.container.offsetWidth, this.container.offsetHeight)
    // 色调映射
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping
    this.renderer.toneMappingExposure = 3
    this.container.appendChild(this.renderer.domElement)
    $(this.container).css({ 'position': 'relative' })
  }
  render () {
    var delta = this.clock.getDelta()
    this.mixer && this.mixer.update(delta)
    this.renderer.render(this.scene, this.camera)
  }
  animate () {
    this.renderer.setAnimationLoop(this.render.bind(this))
  }
  initControls () {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
  }
  initStats () {
    if (!this.option.stats) return
    this.stats = new Stats()
    $(this.stats.domElement).css({ 
      'position': 'absolute',
      'top': '0px',
      'left': '0px'
    })
    this.container.append(this.stats.domElement)
  }
  initGui () {
    if (!this.option.gui) return
    let option = this.option.gui

    this.gui = new Dat.GUI({ name: option.name })
    $(this.gui.domElement).css({ 
      'position': 'absolute',
      'right': '0px',
      'top': '0px'
    })
    this.container.append(this.gui.domElement)

    option.folder.forEach(item => {
      let folder = this.gui.addFolder(item.name)
      folder.open()
      if (item.children && item.children.length) {
        let params = {}
        item.children.forEach(child => {
          params[child.name] = child.method
          let btn = folder.add(params, child.name)
          btn.name(child.name)
        })
      }
    })
  }
  async addMesh () {
    return new Promise((resolve, reject) => {
      Promise.all((this.option.mesh || []).map(async mesh => {
        switch (mesh.type) {
          case 'glb':
            await this.setModel(`${mesh.name}.glb`, mesh)
            break
          case 'cube':
            this.setCube(mesh)
            break
          case 'sphere':
            this.setSphere(mesh)
            break
          case 'chart':
            this.setChart(mesh)
            break
          default:
            break
        }
      })).then(() => {
        resolve()
      })
    })
  }
  setModel (modelName, option) {
    return new Promise((resolve, reject) => {
      const loader = new GLTFLoader().setPath('files/gltf/')
      loader.load(
        modelName,
        (gltf) => {
          this.setPosition(option, gltf.scene)
          this.setRotation(option, gltf.scene)
          gltf.scene.type = 'gltf'
          this.scene.add(gltf.scene)
          this.model.push(gltf.scene)
          resolve()
        },
        (e) => {
          // 模型加载进度
          this.progressFn(e)
        }
      )
    })
  }
  setCube (option) {
    let segments = option.segments || { width: 1, height: 1, depth: 1 }
    const geometry = new THREE.BoxGeometry(segments.width, segments.height, segments.depth)
    const material = new THREE.MeshBasicMaterial({ color: option.color || 0xffffff })
    const cube = new THREE.Mesh(geometry, material)
    this.setPosition(option, cube)
    this.setRotation(option, cube)
    cube.type = 'cube'
    this.scene.add(cube)
    this.model.push(cube)
  }
  setSphere (option) {
    let segments = option.segments || { radius: 1, width: 30, height: 30 }
    const geometry = new THREE.SphereGeometry(segments.radius, segments.width, segments.height)
    const material = new THREE.MeshBasicMaterial({ color: option.color || 0xffffff, wireframe: true })
    const sphere = new THREE.Mesh(geometry, material)
    this.setPosition(option, sphere)
    this.setRotation(option, sphere)
    sphere.type = 'sphere'
    this.scene.add(sphere)
    this.model.push(sphere)
  }
  setChart (option) {
    const canvas = $(option.el).find('canvas')[0]
    canvas.setAttribute('width', option.chartSize.x)
    canvas.setAttribute('height', option.chartSize.y)
    let texture = new THREE.CanvasTexture(canvas)
    const material = new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, transparent: true, map: texture })
    material.map.needsUpdate = true

    const plane = new THREE.PlaneGeometry(option.size.width, option.size.height)
    const chart = new THREE.Mesh(plane, material)
    this.setPosition(option, chart)
    this.setRotation(option, chart)
    chart.type = 'chart'
    this.scene.add(chart)
    this.model.push(chart)
  }
  setPosition (option, mesh) {
    let pos = option.position || { x: 0, y: 0, z: 0 }
    mesh.position.set(pos.x, pos.y, pos.z)
  }
  setRotation (option, mesh) {
    let rot = option.rotation || { x: 0, y: 0, z: 0 }
    mesh.rotation.set(rot.x, rot.y, rot.z)
  }
  listener () {
    let _this = this
    _this.observer = new ResizeObserver(() => _this.onResize())
    _this.observer.observe(_this.container)
    _this.container.addEventListener('mousemove', _this.onMousemove.bind(_this), false)
  }
  removeListener () {
    if (this.observer) {
      this.observer.disconnect(this.container)
    }
    this.container.removeEventListener('mousemove', this.onMousemove.bind(this))
  }
  onResize () {
    let width = this.container.offsetWidth
    let height = this.container.offsetHeight
    this.renderer.setSize(width, height)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
    this.renderer.render(this.scene, this.camera)
  }
  onMousemove (event) {
    let x = event.clientX * this.container.offsetWidth / document.body.clientWidth
    let y = event.clientY * this.container.offsetHeight / document.body.clientHeight
    this.mouse.x = (x / this.renderer.domElement.clientWidth) * 2 - 1
    this.mouse.y = -(y / this.renderer.domElement.clientHeight) * 2 + 1
  }
  tick () {
    this.raycaster.setFromCamera(this.mouse, this.camera)
    let intersects = this.raycaster.intersectObjects(this.scene.children, true)
    if (intersects.length) {
      this.intersect = intersects[0]
    }
    if (this.model && this.model.length) {
      this.model.forEach(model => {
        if (model.type === 'chart') model.material.map.needsUpdate = true
      })
    }
    requestAnimationFrame(this.tick.bind(this))
  }
}

export default Base3D
