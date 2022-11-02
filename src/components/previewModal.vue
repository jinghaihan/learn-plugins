<template>
  <a-modal :visible="visible"
            v-if="visible"
            width="100vw"
            height='100%'
            :maskClosable="false"
            :dialogStyle="preview.dialogStyle"
            :bodyStyle="preview.bodyStyle"
            :footer="null"
            @cancel="closeModal" >
    <a-spin :spinning="loading">
      <!-- docx -->
      <div v-if="data.type === '.docx'"
          class="preview-container"
          id="preview-container">
      </div>

      <!-- pdf -->
      <div class="pdf-container" v-if="data.type === '.pdf'">
        <canvas class="preview-container"
                id="preview-container">
        </canvas>
        <a-pagination class="pagination"
                      :default-current="1"
                      :page-size="1"
                      show-quick-jumper
                      :current='pdfPagination.current'
                      :total="pdfPagination.total"
                      @change="onPdfPaginationChange" />
      </div>

      <!-- xlsx -->
      <div v-if="data.type === '.xlsx'"
           class="preview-container"
           id="preview-container">
      </div>

      <!-- pptx -->
      <div v-if="data.type === '.pptx'"
           class="preview-container"
           id="preview-container">
      </div>

      <!-- txt -->
      <div v-if="data.type === '.txt'"
           class="preview-container"
           id="preview-container">
        <pre>{{text}}</pre>
      </div>

      <!-- mp4 -->
      <div v-if="data.type === '.mp4'"
           class="preview-container"
           id="preview-container">
        <video autoplay controls :src="data.base64"></video>
      </div>

      <!-- mp3 -->
      <div v-if="data.type === '.mp3'"
           class="preview-container"
           id="preview-container">
        <audio autoplay controls :src="data.base64"></audio>
      </div>
    </a-spin>
  </a-modal>
</template>

<script>
import * as PDFJS from 'pdfjs-dist/legacy/build/pdf'
import { defaultOptions, renderAsync } from 'docx-preview'
import { blobToArrayBuffer, base64ToBlob, blobToFile, readAsText } from '@/utils/convert'
import renderPptx from '@/utils/pptx/index'

PDFJS.GlobalWorkerOptions.workerSrc = require('pdfjs-dist/legacy/build/pdf.worker.entry.js')
const LuckySheet = window.luckysheet
const LuckyExcel = window.LuckyExcel

export default {
  name: 'previewFileModal',
  props: {
    visible: {
      type: Boolean,
      required: false
    },
    data: {
      type: Object,
      required: false
    }
  },
  data () {
    return {
      preview: {
        dialogStyle: {
          maxWidth: '100vw',
          top: 0,
          paddingBottom: 0
        },
        bodyStyle: {
          height: '100vh',
          overflowY: 'auto'
        }
      },
      loading: false,
      // pdf预览
      pdfDoc: undefined,
      pdfPagination: {
        current: 1,
        total: 1
      },
      // 文本预览
      text: ''
    }
  },
  created () {
    this.init()
  },
  methods: {
    async init () {
      let _this = this
      _this.loading = true
      // 获取文件
      let blob
      switch (_this.data.type) {
        case '.docx':
          blob = await base64ToBlob(this.data.base64)
          _this.previewDocx(blob)
          break
        case '.pdf':
          blob = await base64ToBlob(this.data.base64)
          _this.previewPdf(blob)
          break
        case '.xlsx':
          blob = await base64ToBlob(this.data.base64)
          _this.previewXlsx(blob)
          break
        case '.pptx':
          blob = await base64ToBlob(this.data.base64)
          _this.previwPptx(blob)
          break
        case '.txt':
          blob = await base64ToBlob(this.data.base64)
          _this.previewText(blob)
          break
        case '.mp4':
          _this.loading = false
          break
        case '.mp3':
          _this.loading = false
          break
        default:
          break
      }
    },
    // docx预览
    previewDocx (blob) {
      let _this = this
      renderAsync(
        blob,
        document.getElementById('preview-container'),
        null,
        defaultOptions
      ).then(() => {
        _this.loading = false
      })
    },
    // pdf预览
    async previewPdf (blob) {
      // 获取ArrayBuffer
      let buffer = await blobToArrayBuffer(blob)
      // 获取pdfDoc
      let pdfDoc = await PDFJS.getDocument({
        data: buffer,
        cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@2.0.943/cmaps/'
      }).promise
      this.pdfDoc = pdfDoc
      // 获取页码总数
      this.pdfPagination.total = pdfDoc.numPages
      // 渲染pdf首页
      this.renderPdfPage(1)
      this.loading = false
    },
    // 渲染pdf页面
    renderPdfPage (page) {
      this.pdfDoc.getPage(page).then(page => {
        const canvas = document.getElementById('preview-container')
        const ctx = canvas.getContext('2d')
        const dpr = window.devicePixelRatio || 1
        const bsr =
            ctx.webkitBackingStorePixelRatio ||
            ctx.mozBackingStorePixelRatio ||
            ctx.msBackingStorePixelRatio ||
            ctx.oBackingStorePixelRatio ||
            ctx.backingStorePixelRatio ||
            1
        const ratio = dpr / bsr
        const viewport = page.getViewport({ scale: 1 })
        canvas.width = viewport.width * ratio
        canvas.height = viewport.height * ratio
        canvas.style.width = viewport.width + 'px'
        canvas.style.height = viewport.height + 'px'
        ctx.setTransform(ratio, 0, 0, ratio, 0, 0)
        const renderContext = {
          canvasContext: ctx,
          viewport: viewport
        }
        page.render(renderContext)
      })
    },
    // pdf文档页码改变
    onPdfPaginationChange (pageNumber) {
      this.pdfPagination.current = pageNumber
      this.renderPdfPage(pageNumber)
    },
    // xlsx预览
    async previewXlsx (blob) {
      let _this = this
      let file = await blobToFile(blob)

      LuckyExcel.transformExcelToLucky(
        file, 
        function (exportJson, luckysheetfile) {
          LuckySheet.create({
            container: 'preview-container',
            title: _this.data.name,
            lang: 'zh',
            data: exportJson.sheets,
            userInfo: exportJson.info.name.creator,
            showinfobar: false,
            showtoolbar: false
          })
          _this.loading = false
        },
        // eslint-disable-next-line handle-callback-err
        function (err) {
          _this.loading = false
        }
      )
    },
    // pptx预览
    async previwPptx (blob) {
      let buffer = await blobToArrayBuffer(blob)
      await renderPptx(buffer, document.getElementById('preview-container'), null)
      this.loading = false
    },
    // 文本预览
    async previewText (blob) {
      this.text = await readAsText(blob)
      this.loading = false
    },
    closeModal () {
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
  /deep/.ant-modal {
    height: 100%;
    .ant-modal-body {
      padding: 0px;
      max-height: unset !important;
      background-color: #f6f6f6 !important;
      .docx-wrapper {
        background: #f5f5f5;
      }
    }
  }
  .preview-container{
    height: 100vh;
    overflow: auto;
    margin: 0 auto;
  }
  .pdf-container{
    .preview-container{
      height: calc(~'100vh - 33px');
    }
    .pagination{
      text-align: center;
    }
  }
</style>
