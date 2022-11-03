<template>
  <div class="container">
    <div ref="scene"></div>
    <a-spin v-if="loading"
            class="spin"
            :spinning="loading"
            :tip="percent + '%'"
            size="large">
      <a-icon class="icon" slot="indicator" type="loading" spin />
    </a-spin>
  </div>
</template>

<script>
import Base3D from '@/utils/Base3D'

export default {
  props: {
    option: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      scene: null,
      percent: 0,
      loading: false
    }
  },
  mounted () {
    this.init()
  },
  beforeDestroy () {
    let gl = this.scene.renderer.domElement.getContext('webgl')
    gl && gl.getExtension('WEBGL_lose_context').loseContext()
    this.scene.removeListener()
  },
  methods: {
    init () {
      let _this = this
      _this.scene = new Base3D(_this.$refs.scene, this.option)
      _this.scene.onProgress((e) => {
        _this.loading = true
        let percent = e.loaded / e.total
        _this.percent = percent.toFixed(2) * 100
        // 模型加载完毕
        if (_this.percent === 100) {
          _this.loading = false
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .container{
    height: 100%;
    position: relative;
    >div{
      height: 100%;
      width: 100%;
    }
    .spin{
      z-index: 10;
      position: absolute;
      top: 0;
      display: flex;
      justify-content: center;
      align-items: center;
      /deep/.ant-spin-text{
        position: absolute;
        font-size: 30px;
      }
      .icon{
        font-size: 100px;
      }
    }
  }
</style>
