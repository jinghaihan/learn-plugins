<template>
  <a-config-provider :locale="locales">
    <div id="app">
      <a-spin :spinning="loading"
              size="large"
              :tip="loadingType === 'request' ? tip[loadingType]() : tip[loadingType]">
        <!-- loading -->
        <a-icon slot="indicator" type="loading" class="spin" spin />
        <div class="container">
          <!-- 上传组件 -->
          <upload ref="upload" :accept="accept" @transform="onTransform"></upload>
          <!-- 操作按钮 -->
          <div class="operation-container">
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
                    :img="file.img"
                    :file="file">
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
import upload from '@/components/upload'
import card from '@/components/card'
import copyright from '@/components/copyright'
import { accept } from './config'

export default {
  name: 'App',
  components: { upload, card, copyright },
  data () {
    return {
      locales: zhCN,
      accept,
      fileList: [],
      loading: false,
      loadingType: '',
      tip: {
        'transform': '转换中...'
      }
    }
  },
  methods: {
    onPreview () {
      
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
        max-height: 300px;
        flex-grow: 1;
        margin: 5px;
        position: relative;
        overflow: hidden;
        width: 100px;
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
