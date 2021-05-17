<template>
  <div class="center-container">
    <div class="text-center">
      <div>
        <mt-button class="large-circle-btn" type="primary" @click="$router.push({path: '/come'})">来到<br/>此地需<br/>登记</mt-button>
        <mt-button class="large-circle-btn" type="danger" @click="$router.push({path: '/leave'})">离开<br/>此地需<br/>注销</mt-button>
      </div>
      <button type="button" class="btn btn-info large-circle-btn" @click="$router.push({path: '/valid'})">查看<br/>房屋/单位<br/>人员</button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  }
}
</script>

<style lang="scss">
.large-circle-btn {
  width: 45vw;
  height: 45vw !important;
  border-radius: 100% !important;
  font-size: 20pt !important;
}
</style>