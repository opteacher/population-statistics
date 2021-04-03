<template>
  <div>
    <mt-header v-if="lsMode === 'select'" title="选择模式">
      <router-link to="/" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <mt-search v-model="searchItem.schWords" :show="true" @input="onSchWdsChanged('searchItem', [
      'name', 'shopName', 'address', 'lglName', 'lglPhone', 'phone', 'lvAddress', 'company'
    ])">
      <mt-radio v-if="lsMode === 'select'"
        align="right"
        v-model="selCmp"
        :options="searchItem.mchItems.map(item => item.name)"/>
      <mt-cell v-else v-for="item in searchItem.mchItems"
        :title="lsType === 'company' ? item.shopName : (lsType === 'house' ? item.address : item.name)"
        :label="lsType === 'company' ? item.name : ''"
        :key="item.id"
        :to="`/population-statistics/${lsType === 'house' ? 'company' : lsType}-detail?${(new URLSearchParams(item)).toString()}`"
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
import utils from "../utils"
import "url"
import { MessageBox, Toast } from "mint-ui"

export default {
  components: {
    "btm-navi-bar": btmNaviBar
  },
  data() {
    return {
      lsType: "",
      lsMode: "display",
      searchItem: {
        schWords: "",
        allItems: [],
        mchItems: []
      },
      URLSearchParams,
      selCmp: "",
      edtEmployee: {}
    }
  },
  created() {
    if (this.$route.query.search) {
      this.searchItem.schWords = this.$route.query.search
    }
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
    async onSelTabChanged(selTab) {
      this.lsType = selTab
      let urlParamStr = ""
      if (selTab === "company") {
        urlParamStr = "?shopName=!=&shopName="
      } else if (selTab === "house") {
        selTab = "company"
        urlParamStr = "?shopName===&shopName="
      }
      const url = `/population-statistics/mdl/v1/${selTab}s${urlParamStr}`
      await utils.reqBackend(this.axios.get(url), data => {
        this.searchItem.allItems = data
        this.searchItem.mchItems = this.searchItem.allItems
      })
    },
    onCfmSelClick() {
      this.edtEmployee.workComp = this.selCmp
      this.$router.push({
        path: `/population-statistics/home?type=person&${(new URLSearchParams(this.edtEmployee)).toString()}`
      })
    },
    onSchWdsChanged: utils.onSchWdsChanged
  }
}
</script>