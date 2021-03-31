<template>
  <div>
    <mt-cell title="姓名" :value="form.name"/>
    <mt-cell title="身份证" :value="form.idCard"/>
    <mt-field label="去向地址" placeholder="请输入将前往居住的地址" v-model="form.toAddress"/>
    <div class="sch-whereto-panel">
      <div class="h-100">
        <mt-cell v-for="house in searchHouse.mchItems"
          :title="house.address"
          :key="house.id"
          is-link @click.native="onHouseLnkClick(house.address)"/>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    "form": Object
  },
  data() {
    return {
      searchHouse: {
        schWords: "",
        allItems: [],
        mchItems: []
      }
    }
  },
  async created() {
    const res = await this.axios.get("/population-statistics/mdl/v1/companys?shopName===&shopName=")
    if (res.status != 200) {
      Toast({
        message: `系统错误！${res.statusText}`,
        iconClass: "iconfont icon-close-bold"
      })
    } else {
      this.searchHouse.allItems = res.data.data
      this.searchHouse.mchItems = this.searchHouse.allItems
    }
  },
  methods: {
    onHouseLnkClick(address) {
      this.form.toAddress = address
    }
  }
}
</script>

<style>
.sch-whereto-panel {
  position: fixed;
  margin-top: 1vh;
  right: 0;
  left: 0;
  top: 204px;
  bottom: 60px;
  overflow-y: scroll
}
</style>