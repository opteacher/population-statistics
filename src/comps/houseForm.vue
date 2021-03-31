<template>
<mt-search v-model="schWords" :show="true">
  <mt-radio
    v-if="isForWork"
    style="margin-top: 60px"
    align="right"
    v-model="form.cmpId"
    :options="mchHouses.map(company => ({
      label: company.name,
      value: company.id
    }))"/>
  <mt-radio
    v-else
    style="margin-top: 60px"
    align="right"
    v-model="form.lvAddress"
    :options="mchHouses.map(house => house.address)"/>
</mt-search>
</template>

<script>
export default {
  props: {
    "form": Object
  },
  data() {
    return {
      isForWork: false,
      schWords: "",
      mchHouses: [],
      houses: []
    }
  },
  watch: {
    "form.cmpId": function(n, o) {
      for (let comp of this.mchComps) {
        if (comp.id === n) {
          this.form.company = comp.name
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
      this.houses = res.data.data.map(house => {
        house.id = house.id.toString()
        return house
      })
      this.mchHouses = this.houses
    }
  }
}
</script>
