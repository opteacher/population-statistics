<template>
  <div class="center-container">
    <div>
      <mt-button class="large-circle-btn" type="primary" @click="$router.push({path: '/population-statistics/come'})">来登</mt-button>
      <hr/>
      <mt-button class="large-circle-btn" type="danger" @click="$router.push({path: '/population-statistics/leave'})">去销</mt-button>
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
  font-size: 30pt !important;
}
</style>