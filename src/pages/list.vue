<template>
  <div>
    <mt-search v-model="schWords" :show="true" @input="onSchWdsChanged">
      <mt-radio v-if="lsMode === 'select'"
        align="right"
        v-model="selCmp"
        :options="mchItems.map(item => item.name)"/>
      <mt-cell v-else v-for="item in mchItems"
        :title="lsType === 'company' ? `(${item.shopName}) ${item.name}` : (lsType === 'house' ? item.address : item.name)"
        :key="item.id"
        :to="`/population-statistics/${lsType}-detail?${(new URLSearchParams(item)).toString()}`"
        is-link
        value="详情"/>
    </mt-search>
    <div  v-if="lsMode === 'select'" class="w-100 fixed-bottom mb-55" style="background-color: white">
      <mt-button class="mlr-1pc mtb-1pc" style="width: 98vw" type="primary" @click="onCfmSelClick">确定</mt-button>
    </div>
    <btm-navi-bar :select="lsType" :onSelTabChanged="onSelTabChanged"/>
  </div>
</template>

<script>
import btmNaviBar from "../comps/btmNaviBar"
import "url"

export default {
  components: {
    "btm-navi-bar": btmNaviBar
  },
  data() {
    return {
      lsType: "",
      lsMode: "display",
      schWords: "",
      mchItems: [],
      data: [],
      URLSearchParams,
      selCmp: "",
      edtEmployee: {}
    }
  },
  created() {
    this.lsMode = this.$route.query.mode || "display"
    this.onSelTabChanged(this.$route.query.type)
    if (this.lsMode === "select") {
      this.edtEmployee = Object.assign(this.$route.query)
      delete this.edtEmployee.type
      delete this.edtEmployee.mode
      this.selCmp = this.edtEmployee.workComp || ""
    }
  },
  methods: {
    onSchWdsChanged(e) {
      if (!e) {
        this.mchItems = this.data
      } else {
        this.mchItems = []
        this.data.map(item => {
          if (this.lsType === "company") {
            if (item.name.includes(e)
            || item.shopName.includes(e)
            || item.address.includes(e)
            || item.lglName.includes(e)
            || item.lglPhone.includes(e)) {
              this.mchItems.push(item)
            }
          } else {
            if (item.name.includes(e)
            || item.phone.includes(e)
            || item.lvAddress.includes(e)) {
              this.mchItems.push(item)
            }
          }
        })
      }
    },
    async onSelTabChanged(selTab) {
      this.lsType = selTab
      let urlParamStr = ""
      if (selTab === "company") {
        urlParamStr = "?shopName=!=&shopName="
      } else if (selTab === "house") {
        selTab = "company"
        urlParamStr = "?shopName===&shopName="
      }
      const res = await this.axios.get(`/population-statistics/mdl/v1/${selTab}s${urlParamStr}`)
      if (res.status != 200) {
        Toast({
          message: `系统错误！${res.statusText}`,
          iconClass: "iconfont icon-close-bold"
        })
      } else {
        this.data = res.data.data
        this.mchItems = this.data
      }
    },
    onCfmSelClick() {
      this.edtEmployee.workComp = this.selCmp
      this.$router.push({
        path: `/population-statistics/home?type=person&${(new URLSearchParams(this.edtEmployee)).toString()}`
      })
    }
  }
}
</script>