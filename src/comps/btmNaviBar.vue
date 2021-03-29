<template>
  <mt-tabbar v-model="selected">
    <mt-tab-item id="input">
      <img slot="icon" src="/assets/imgs/import.png">录入
    </mt-tab-item>
    <mt-tab-item id="company">
      <img slot="icon" src="/assets/imgs/work.png">实有单位
    </mt-tab-item>
    <mt-tab-item id="person">
      <img slot="icon" src="/assets/imgs/user.png">实有人员
    </mt-tab-item>
    <mt-tab-item id="admin">
      <img slot="icon" src="/assets/imgs/lock.png">管理员
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
        "input": "/population-statistics/home",
        "company": "/population-statistics/list?type=company",
        "person": "/population-statistics/list?type=person",
        "admin": "/population-statistics/admin"
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