<template>
  <a-card size="small" hoverable >
    <img class="image" v-if="img" slot="cover" alt="image" :src="img" />
    <a-card-meta :title="title">
      <template slot="description">
        <div v-for="(item, index) in meta"
             :key="title + '-meta-' + index"
             class="meta-container">
          <div v-for="(key, keyIndex) in Object.keys(item)"
               :key="title + '-meta-' + index + '-key-' + keyIndex"
               class="meta-item-container">
               <label class="label">{{key}}：</label>
               <p class="value">{{item[key]}}</p>
          </div>
        </div>
      </template>
    </a-card-meta>
  </a-card>
</template>

<script>
export default {
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
    meta: {
      type: Array,
      required: true
    }
  }
}
</script>

<style lang="less" scoped>
  .meta-item-container{
    display: flex;
    .label{
      font-weight: bold;
    }
  }
</style>
