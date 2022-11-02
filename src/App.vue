<template>
  <a-config-provider :locale="locales">
    <div id="app">
      <a-spin :spinning="loading"
              size="large"
              :tip="loadingType === 'request' ? tip[loadingType]() : tip[loadingType]">
        <!-- loading -->
        <a-icon slot="indicator" type="loading" class="spin" spin />
        <div class="container">
          <!-- 选择 -->
          <div class="select-container">
            <a-select class="select"
                      :value="target.value"
                      placeholder="请选择"
                      :options="options"
                      @change="onChange"
                      :disabled="loading">
            </a-select>
          </div>
          <!-- 上传组件 -->
          <upload ref="upload" :accept="target.accept" @transform="onTransform"></upload>
          <!-- 操作按钮 -->
          <div class="operation-container">
            <a-button class="button"
                      icon="play-circle"
                      type="primary"
                      @click="onRequest"
                      :disabled="!fileList.length"
                      :loading="loading"> 请求 </a-button>
            <a-button class="button"
                      icon="cloud-download"
                      @click="onDownload"
                      :disabled="!canDownload || !fileList.length || loading"> 导出 </a-button>
            <a-button class="button"
                      icon="delete"
                      type="danger"
                      @click="onReset"
                      :disabled="!fileList.length || loading"> 重置 </a-button>
          </div>
          <!-- 卡片展示 -->
          <div class="card-container">
            <section class="section">
              <card v-for="(file, index) in fileList"
                    :key="file.name + '-' + index"
                    class="card"
                    :title="file.name"
                    :img="file.base64"
                    :meta="file.meta">
              </card>
            </section>
          </div>
        </div>
        <copyright></copyright>
      </a-spin>
    </div>
  </a-config-provider>
</template>

<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import Vue from 'vue'
import axios from 'axios'
import upload from '@/components/upload'
import card from '@/components/card'
import copyright from '@/components/copyright'
import { handler, options } from './config'
import output from './output'

export default {
  name: 'App',
  components: { upload, card, copyright },
  data () {
    return {
      locales: zhCN,
      fileList: [],
      options,
      target: options[0],
      loading: false,
      loadingType: '',
      tip: {
        'transform': '转换中...',
        'download': '导出中...',
        'request': () => this.getPercent() + '%'
      },
      count: 0,
      canDownload: false
    }
  },
  methods: {
    onRequest () {
      this.handleRequest(this.fileList)
    },
    handleRequest (fileList) {
      let _this = this
      _this.startLoading('request')
      Promise.all(fileList.map(async file => {
        let option = {
          timeout: 1000 * 60 * 5,
          url: _this.target.url,
          method: _this.target.method,
          headers: _this.target.headers,
          data: { file: file.base64 }
        }
        let response = await axios(option)
        _this.count++
        return response
      })).then(async result => {
        _this.count = 0
        result.forEach((response, index) => {
          let meta = handler[_this.target.value](response)
          _this.fileList[index].response = response.data
          Vue.set(_this.fileList[index], 'meta', meta)
        })
        await _this.$nextTick()
        _this.stopLoading()
        _this.canDownload = true
      })
    },
    onTransform (complete) {
      if (!complete) {
        this.startLoading('transform')
        return
      }
      this.stopLoading()
      this.fileList = this.$refs.upload.fileList
    },
    onReset () {
      this.fileList = []
      this.$refs.upload.queue = []
      this.$refs.upload.fileList = []
      this.$refs.upload.count = 0
    },
    async onDownload () {
      let element = document.getElementById('app')

      let data = {
        ...await output.getPdf(element, this),
        ...await output.getJson(this.fileList.map(file => {
          return {
            name: file.name,
            ...file.response
          }
        })),
        ...await output.getXlsx(this.fileList.map(file => {
          return {
            name: file.name,
            meta: file.meta
          }
        }))
      }
      output.downloadZip(window.copyright + '-' + this.target.label, data)
      this.stopLoading()
    },
    onChange (value) {
      let _this = this

      if (!_this.fileList.length) {
        _this.target = _this.options.filter(opt => opt.value === value)[0]
        return
      }

      _this.$confirm({
        title: '确认切换吗？',
        content: '切换将清空全部上传列表',
        confirmLoading: true,
        okText: '确定',
        cancelText: '取消',
        async onOk () {
          _this.target = _this.options.filter(opt => opt.value === value)[0]
          _this.onReset()
        },
        onCancel () { }
      })
    },
    getPercent () {
      let num = (this.count / this.fileList.length) * 100
      return isNaN(num) ? 0 : parseInt(num)
    },
    startLoading (type) {
      this.loadingType = type
      this.loading = true
    },
    stopLoading () {
      this.loading = false
      this.loadingType = ''
    }
  }
}
</script>

<style lang="less" scoped>
  .container{
    padding: 40px;
    min-height: calc(~"100vh - 60px");
    >*{
      margin-bottom: 20px;
    }
    .select-container{
      .select{
        width: 240px;
      }
    }
    .operation-container{
      display: flex;
      justify-content: center;
      align-items: center;
      .button{
        margin: 0 8px;
      }
    }
    .card-container{
      .section{
        display: flex;
        flex-wrap: wrap;
        padding: 5px;
      }
      .section::after{
        content: '';
        flex-grow: 99999;
      }
      .card {
        max-height: 395px;
        flex-grow: 1;
        margin: 5px;
        position: relative;
        overflow: hidden;
        /deep/.ant-card-cover{
          .image{
            height: 170px;
            min-width: 100%;
            object-fit: cover;
          }
        }
      }
    }
  }
</style>

<style>
  ::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  ::-webkit-scrollbar-track {
    box-shadow: inset 0 0 0px rgba(240, 240, 240, 0.5);
    border-radius: 10px;
    background-color: rgba(50, 50, 50, .1);
  }
  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 0px rgba(240, 240, 240, 0.5);
    background-color: rgba(50, 50, 50, .3);
  }
</style>
