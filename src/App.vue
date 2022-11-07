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
import option from './option'

export default {
  name: 'App',
  components: { Scene },
  data () {
    return {
      locales: zhCN,
      visible: false,
      option: option['hdr']
    }
  },
  mounted () {
    this.init()
  },
  methods: {
    init () {
      if (this.option.mesh && this.option.mesh[0].type === 'chart') {
        this.initChart()
      }
      this.visible = true
    },
    initChart () {
      let option = {
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            name: 'Access From',
            type: 'pie',
            radius: '50%',
            data: [
              { value: 1048, name: 'Search Engine' },
              { value: 735, name: 'Direct' },
              { value: 580, name: 'Email' },
              { value: 484, name: 'Union Ads' },
              { value: 300, name: 'Video Ads' }
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)'
              }
            }
          }
        ]
      }
      this.chart = echarts.init(this.$refs.chart)
      this.chart.setOption(option)
      this.option.mesh[0].el = this.$refs.chart

      setInterval(() => {
        option.series[0].data = option.series[0].data.map(item => {
          return {
            name: item.name,
            value: (Math.random() * 1000).toFixed(0)
          }
        })
        this.chart.setOption(option)
      }, 5000)
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
