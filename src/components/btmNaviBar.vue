<template>
  <mt-tabbar v-model="selected">
    <mt-tab-item id="admin">
      <svg slot="icon" class="icon" aria-hidden="true">
        <use xlink:href="#icon-lock"></use></svg
      >管理员
    </mt-tab-item>
    <mt-tab-item id="input">
      <svg slot="icon" class="icon" aria-hidden="true">
        <use xlink:href="#icon-import"></use></svg
      >录入
    </mt-tab-item>
    <mt-tab-item id="house">
      <svg slot="icon" class="icon" aria-hidden="true">
        <use xlink:href="#icon-home"></use></svg
      >实有房屋
    </mt-tab-item>
    <mt-tab-item id="company">
      <svg slot="icon" class="icon" aria-hidden="true">
        <use xlink:href="#icon-work"></use></svg
      >实有单位
    </mt-tab-item>
    <mt-tab-item id="person">
      <svg slot="icon" class="icon" aria-hidden="true">
        <use xlink:href="#icon-user"></use></svg
      >实有人员
    </mt-tab-item>
    <mt-tab-item id="approve">
      <svg slot="icon" class="icon" aria-hidden="true">
        <use xlink:href="#icon-shenpi"></use></svg
      >审批
    </mt-tab-item>
  </mt-tabbar>
</template>

<script>
export default {
  props: {
    select: String,
    onSelTabChanged: Function,
  },
  data() {
    return {
      selected: this.$props.select,
      pagesMap: {
        admin: '/admin',
        input: '/input',
        house: '/list?type=house',
        company: '/list?type=company',
        person: '/list?type=person',
        approve: '/approve',
      },
    }
  },
  watch: {
    selected(n, o) {
      this.$router.push(this.pagesMap[n])
      this.$emit('change', n)
    },
  },
}
</script>

<style lang="less">
.wh-24::before {
  width: 24px;
  height: 24px;
}
</style>
