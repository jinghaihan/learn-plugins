import Vue from 'vue'
import App from './App.vue'
// 全局样式
import '@/styles/global.less'
// 插件
import './plugins'

Vue.config.productionTip = false

let instance = null
function render () {
  instance = new Vue({
    render: h => h(App)
  })
  instance.$mount('#app')
}

render()
