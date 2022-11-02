<template>
  <a-tooltip v-model="tooltipVisible">
    <template slot="title">{{title}}</template>
    <a-card size="small" hoverable  @click="onPreview">
      <img class="image" v-if="img" alt="image" :src="img" />
    </a-card>

    <preview-modal v-if="previewVisible"
                   :visible="previewVisible"
                   :data="file"
                   @close="previewVisible = false">
    </preview-modal>
  </a-tooltip>
</template>

<script>
import previewModal from './previewModal.vue'

export default {
  components: { previewModal },
  props: {
    title: {
      type: String,
      required: false,
      default: 'title'
    },
    img: {
      type: String,
      required: false
    },
    file: {
      type: Object,
      required: false
    }
  },
  data () {
    return {
      previewVisible: false,
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
      tooltipVisible: false
    }
  },
  methods: {
    onPreview () {
      this.tooltipVisible = false
      this.previewVisible = true
    }
  }
}
</script>

<style lang="less" scoped>
  /deep/.ant-card-body{
    padding: 24px !important;
  }
  .image{
    height: 50px;
    width: 50px;
  }
  .preview-container{
    max-height: 100%;
    overflow: auto;
  }
</style>
