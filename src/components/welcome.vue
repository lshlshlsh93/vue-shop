<template>
  <div>
    <h3>Welcome</h3>
    <el-carousel
      indicator-position="outside"
      style="overflow:hidden !important;"
    >
      <el-carousel-item v-for="item in imgs" :key="item.url">
        <img :src="item.url" />
      </el-carousel-item>
    </el-carousel>
  </div>
</template>
<script>
export default {
  data() {
    return {
      imgs: [
        { url: require('../assets/img/1.jpg') },
        { url: require('../assets/img/2.jpg') },
        { url: require('../assets/img/3.jpg') },
        { url: require('../assets/img/4.jpg') }
      ]
    }
  }
}
</script>
<style scoped>
img {
  width: 1259.2px;
  height: 328.8px;
}
</style>
