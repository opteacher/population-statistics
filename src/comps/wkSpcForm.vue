<template>
<mt-search v-model="schWords" :show="true">
  <mt-radio
    style="margin-top: 60px"
    align="right"
    v-model="form.workCompId"
    :options="mchComps.map(company => ({
      label: company.name,
      value: company.id
    }))"/>
</mt-search>
</template>

<script>
export default {
  props: {
    "form": Object
  },
  data() {
    return {
      schWords: "",
      mchComps: [],
      companies: []
    }
  },
  watch: {
    "form.workCompId": function(n, o) {
      for (let comp of this.mchComps) {
        if (comp.id === n) {
          this.form.workComp = comp.name
        }
      }
    }
  },
  async created() {
    const res = await this.axios.get("/population-statistics/mdl/v1/companys?shopName=!=&shopName=")
    if (res.status != 200) {
      Toast({
        message: `系统错误！${res.statusText}`,
        iconClass: "iconfont icon-close-bold"
      })
    } else {
      this.companies = res.data.data.map(company => {
        company.id = company.id.toString()
        return company
      })
      this.mchComps = this.companies
    }
  }
}
</script>
