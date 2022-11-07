<template>
  <a-config-provider :locale="locales">
    <div id="app">
      <Scene v-if="visible" :option="option"></Scene>
      <div v-show="false" ref="chart" class="chart"></div>
    </div>
  </a-config-provider>
</template>

<script>
import * as echarts from 'echarts'
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import Scene from '@/components/3dScene.vue'

export default {
  name: 'App',
  components: { Scene },
  data () {
    return {
      locales: zhCN,
      visible: false,
      option: {
        scene: {
          // type: 'hdr',
          // name: '001'
          type: 'sphere-vr',
          name: 'sphere.jpg'
        },
        mesh: [
          // {
          //   type: 'chart',
          //   el: null,
          //   chartSize: { x: 512, y: 512 },
          //   size: { width: 1, height: 1 }
          // }
          // {
          //   type: 'glb',
          //   name: 'shoes'
          // },
          // {
          //   type: 'cube',
          //   segments: { width: 1, height: 1, depth: 1 },
          //   position: { x: 1, y: 0, z: 0 },
          //   rotation: { x: 1, y: 0, z: 0 },
          //   color: 0x00ff00
          // },
          // {
          //   type: 'sphere',
          //   segments: { radius: 1, width: 35, height: 35 },
          //   color: 0x00ff00
          // }
        ]
        // stats: true,
        // gui: {
        //   name: 'jinghaihan',
        //   folder: [
        //     {
        //       name: 'jing',
        //       children: [
        //         {
        //           name: 'haihan',
        //           method: () => { console.log('jinghaihan') }
        //         }
        //       ]
        //     }
        //   ]
        // }
      }
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      // let option = {
      //   tooltip: {
      //     trigger: 'item'
      //   },
      //   series: [
      //     {
      //       name: 'Access From',
      //       type: 'pie',
      //       radius: '50%',
      //       data: [
      //         { value: 1048, name: 'Search Engine' },
      //         { value: 735, name: 'Direct' },
      //         { value: 580, name: 'Email' },
      //         { value: 484, name: 'Union Ads' },
      //         { value: 300, name: 'Video Ads' }
      //       ],
      //       emphasis: {
      //         itemStyle: {
      //           shadowBlur: 10,
      //           shadowOffsetX: 0,
      //           shadowColor: 'rgba(0, 0, 0, 0.5)'
      //         }
      //       }
      //     }
      //   ]
      // }
      // this.chart = echarts.init(this.$refs.chart)
      // this.chart.setOption(option)
      // this.option.mesh[0].el = this.$refs.chart
      // this.visible = true

      // setInterval(() => {
      //   option.series[0].data = option.series[0].data.map(item => {
      //     return {
      //       name: item.name,
      //       value: (Math.random() * 1000).toFixed(0)
      //     }
      //   })
      //   this.chart.setOption(option)
      // }, 5000)

      this.visible = true
    }
  }
}
</script>

<style lang="less" scoped>
  .chart{
    height: 400px;
    width: 400px;
  }
</style>
