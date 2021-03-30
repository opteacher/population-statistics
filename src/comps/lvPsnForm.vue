<template>
  <div>
    <mt-navbar v-model="selTab">
      <mt-tab-item id="house">所在房屋</mt-tab-item>
      <mt-tab-item id="person">个人信息</mt-tab-item>
    </mt-navbar>

    <!-- tab-container -->
    <mt-tab-container class="mt-3" v-model="selTab">
      <mt-tab-container-item id="house">
      </mt-tab-container-item>
      <mt-tab-container-item id="person">
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      selTab: "house"
    }
  }
}
</script>

