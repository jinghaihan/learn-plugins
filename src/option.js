const option = {
  hdr: {
    scene: {
      type: 'hdr',
      name: '001'
    },
    mesh: [
      {
        type: 'glb',
        name: 'shoes'
      }
    ]
  },
  cubeVr: {
    scene: {
      type: 'cube-vr',
      name: 'cube.jpg'
    }
  },
  sphereVr: {
    scene: {
      type: 'sphere-vr',
      name: 'sphere.jpg'
    }
  },
  chart: {
    scene: {},
    mesh: [
      {
        type: 'chart',
        el: null,
        chartSize: { x: 512, y: 512 },
        size: { width: 1, height: 1 }
      }
    ]
  },
  cube: {
    scene: {},
    mesh: [
      {
        type: 'cube',
        segments: { width: 1, height: 1, depth: 1 },
        position: { x: 1, y: 0, z: 0 },
        rotation: { x: 1, y: 0, z: 0 },
        color: 0x00ff00
      }
    ]
  },
  sphere: {
    scene: {},
    mesh: [
      {
        type: 'sphere',
        segments: { radius: 1, width: 35, height: 35 },
        color: 0x00ff00
      }
    ]
  }
}

export default option
