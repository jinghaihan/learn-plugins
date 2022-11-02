<template>
  <div class="copyright-container">
    Copyright
    <a-icon class="icon" type="copyright"></a-icon>
    <span>{{copyright}}</span>
  </div>
</template>

<script>
export default {
  data () {
    return {
      copyright: window.copyright
    }
  }
}
</script>

<style lang="less" scoped>
  .copyright-container{
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    .icon{
      display: inline-block;
      margin: 2px 8px 0 4px;
    }
  }
</style>
