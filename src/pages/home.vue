<template>
  <div class="center-container">
    <div class="text-center" style="margin-top: -10vh">
      <mt-button class="large-circle-btn" type="primary" @click="$router.push({path: '/population-statistics/come'})">来到<br/>此地需<br/>登记</mt-button>
      <hr/>
      <mt-button class="large-circle-btn" type="danger" @click="$router.push({path: '/population-statistics/leave'})">离开<br/>此地需<br/>注销</mt-button>
    </div>
    <button type="button" class="btn btn-success float-left-button" @click="onUpPsnClick">提升<br/>人员<br/>为负责人</button>
    <button type="button" class="btn btn-info float-right-button" @click="$router.push({path: '/population-statistics/valid'})">查看<br/>房屋/单位<br/>实有人口</button>
  </div>
</template>

<script>
import { Toast } from "mint-ui"
export default {
  data() {
    return {
    }
  },
  methods: {
    onUpPsnClick() {
      Toast({
        message: "提升负责人功能现管理员指定",
        iconClass: "iconfont icon-warning"
      })
    }
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

.float-left-button {
  position: fixed;
  left: 5vw;
  bottom: 3vh;
  width: 35vw;
  height: 35vw;
  border-radius: 100% !important;
}

.float-right-button {
  position: fixed;
  right: 5vw;
  bottom: 3vh;
  width: 35vw;
  height: 35vw;
  border-radius: 100% !important;
}
</style>