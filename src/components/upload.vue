<template>
  <div class="upload-container">
    <a-upload-dragger
      :accept="accept"
      :multiple="multiple"
      :showUploadList="false"
      :beforeUpload="onUpload"
      :file-list="[]"
      :disabled="!!fileList.length"
    >
      <p class="ant-upload-drag-icon">
        <a-icon type="cloud-upload" />
      </p>
      <p class="ant-upload-text">
        将文件拖到此处，或<em>点击选择</em>
      </p>
      <p class="ant-upload-hint" v-if="accept">
        文件支持{{accept}}类型
      </p>
    </a-upload-dragger>
  </div>
</template>

<script>

export default {
  props: {
    accept: {
      type: String,
      required: false
    },
    multiple: {
      type: Boolean,
      required: false,
      default: true
    }
  },
  data () {
    return {
      queue: [],
      fileList: [],
      count: 0,
      img: {
        docx: require('@/assets/docx.png')
      }
    }
  },
  created () {
    this.accept.split(',').forEach(suffix => {
      let name = suffix.slice(1, suffix.length)
      this.img[suffix] = require(`@/assets/${name}.png`)
    })
  },
  methods: {
    onUpload (file, filelist) {
      let _this = this
      _this.$emit('transform', false)
      _this.count += 1

      // 扩展名校验
      let name = file.name
      let suffix = '.' + name.split('.')[name.split('.').length - 1]
      let accept = _this.accept.split(',')
      if (!accept.includes(suffix.toLowerCase())) {
        _this.$notification.error({
          message: '错误',
          description: `不支持此文件格式 ${file.name}`
        })
      }

      _this.queue.push(new Promise((resolve, reject) => {
        let reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = () => {
          resolve({
            name: file.name,
            base64: reader.result,
            img: _this.img[suffix],
            type: suffix
          })
        }
      }))
      
      if (_this.count === filelist.length) {
        Promise.all(_this.queue).then(fileList => {
          _this.fileList = fileList
          _this.$emit('transform', true)
        })
      }

      return false
    }
  }
}
</script>

<style lang="less" scoped>
  .upload-container{
    height: 180px;
    display: flex;
    align-items: center;
    justify-content: center;
    /deep/.ant-upload-drag{
      height: 180px;
      width: 360px;
    }
    em{
      color: #1890ff;
      font-style: normal;
    }
  }
</style>
