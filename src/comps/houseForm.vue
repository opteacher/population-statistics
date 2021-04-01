<template>
  <mt-search class="house-company-searcher" v-model="searchHouse.schWords" :show="true" @input="onSchWdsChanged('searchHouse', ['address'])">
    <mt-radio
      v-if="isForWork"
      align="right"
      v-model="form.cmpId"
      :options="searchHouse.mchItems.map(company => ({
        label: company.shopName || company.name,
        value: company.id
      }))"/>
    <mt-radio
      v-else
      align="right"
      v-model="form.lvAddress"
      :options="searchHouse.mchItems.map(house => house.address)"/>
  </mt-search>
</template>

<script>
import {onSchWdsChanged} from "../utils"

export default {
  props: {
    "form": Object
  },
  data() {
    return {
      isForWork: false,
      searchHouse: {
        schWords: "",
        allItems: [],
        mchItems: []
      }
    }
  },
  watch: {
    "form.cmpId": function(n, o) {
      for (let comp of this.searchHouse.mchItems) {
        if (comp.id === n) {
          this.form.company = comp.shopName
        }
      }
    }
  },
  async created() {
    this.isForWork = this.form.purpose === "work"
    const res = await this.axios.get(`/population-statistics/mdl/v1/companys?shopName=${this.isForWork ? '!' : '='}=&shopName=`)
    if (res.status != 200) {
      Toast({
        message: `系统错误！${res.statusText}`,
        iconClass: "iconfont icon-close-bold"
      })
    } else {
      this.searchHouse.allItems = res.data.data.map(house => {
        house.id = house.id.toString()
        return house
      })
      this.searchHouse.mchItems = this.searchHouse.allItems
    }
  },
  methods: {
    onSchWdsChanged
  }
}
</script>

<style lang="scss">
.house-company-searcher .mint-search-list {
  bottom: 61px !important;
  overflow-y: scroll !important;
}
</style>
