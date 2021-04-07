<template>
  <mt-tabbar v-model="selected" style="position: fixed">
    <mt-tab-item id="input">
      <img slot="icon" src="/assets/imgs/import.png">录入
    </mt-tab-item>
    <mt-tab-item id="house">
      <img slot="icon" src="/assets/imgs/home.png">实有房屋
    </mt-tab-item>
    <mt-tab-item id="company">
      <img slot="icon" src="/assets/imgs/work.png">实有单位
    </mt-tab-item>
    <mt-tab-item id="person">
      <img slot="icon" src="/assets/imgs/user.png">实有人员
    </mt-tab-item>
    <mt-tab-item id="approve">
      <img slot="icon" src="/assets/imgs/approve.png">审批
    </mt-tab-item>
  </mt-tabbar>
</template>

<script>
export default {
  props: {
    "select": String,
    "onSelTabChanged": Function
  },
  data() {
    return  {
      selected: this.$props.select,
      pagesMap: {
        "input": "/population-statistics/input",
        "house": "/population-statistics/list?type=house",
        "company": "/population-statistics/list?type=company",
        "person": "/population-statistics/list?type=person",
        "approve": "/population-statistics/approve"
      }
    }
  },
  watch: {
    selected(n, o) {
      this.$router.push({path: this.pagesMap[n]})
      this.onSelTabChanged && this.onSelTabChanged(n)
    }
  }
}
</script>