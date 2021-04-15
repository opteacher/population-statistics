<template>
  <div class="center-container">
    <div class="text-center">
      <mt-button class="large-circle-btn" type="primary" @click="$router.push({path: '/population-statistics/come'})">来到<br/>此地需<br/>登记</mt-button>
      <hr/>
      <mt-button class="large-circle-btn" type="danger" @click="$router.push({path: '/population-statistics/leave'})">离开<br/>此地需<br/>注销</mt-button>
      <div style="margin-top: 30px"/>
      <mt-button type="default" class="float-button" @click="$router.push({path: '/population-statistics/people'})">查看房屋/单位实有人口</mt-button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
    }
  },
  async created() {
  }
}
</script>

<style lang="scss">
.large-circle-btn {
  width: 50vw;
  height: 50vw !important;
  border-radius: 100% !important;
  font-size: 20pt !important;
}
</style>