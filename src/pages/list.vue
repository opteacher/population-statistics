<template>
  <div>
    <mt-header v-if="lsMode === 'select'" title="选择模式">
      <mt-button icon="back" slot="left" @click.native="$router.go(-1)">返回</mt-button>
    </mt-header>
    <mt-search class="nml-search" :class="{'sel-search': lsMode === 'select'}" v-model="searchItem.schWords" :show="true" @input="onSchWdsChanged('searchItem', [
      'name', 'shopName', 'address', 'lglName', 'lglPhone', 'phone', 'lvAddress', 'company'
    ])">
      <mt-radio v-if="lsMode === 'select'"
        align="right"
        v-model="edtEmployee.cmpId"
        :options="searchItem.mchItems.map(item => ({
          label: item.shopName,
          value: item.id.toString()
        }))"/>
      <mt-cell v-else v-for="item in searchItem.mchItems" :key="item.id"
        :title="lsType === 'company' ? item.shopName : (lsType === 'house' ? item.address : item.name)"
        :label="lsType === 'company' ? item.name : (item.company || item.lvAddress)"
        is-link :to="`/population-statistics/${lsType === 'house' ? 'company' : lsType}-detail?${(new URLSearchParams(item)).toString()}`">
        <mt-badge v-if="lsType === 'house'" type="success" slot="icon">{{`${item.psnNum}人`}}</mt-badge>
        <span>详情</span>
      </mt-cell>
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
      edtEmployee: {}
    }
  },
  watch: {
    "edtEmployee.cmpId": function(n, o) {
      for (let item of this.searchItem.mchItems) {
        if (item.id == n) {
          this.edtEmployee.company = item.shopName
          break
        }
      }
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
      this.edtEmployee.cmpId = this.edtEmployee.cmpId === -1 ? "" : this.edtEmployee.cmpId.toString()
    }
  },
  methods: {
    async onSelTabChanged(selTab) {
      this.lsType = selTab
      let urlParamStr = ""
      let url = ""
      switch (selTab) {
      case "company":
        url = "/population-statistics/mdl/v1/companys?shopName=!=&shopName="
        break
      case "house":
        url = "/population-statistics/api/v1/houses/people"
        break
      case "person":
        url = "/population-statistics/mdl/v1/persons"
        break
      }
      this.searchItem.allItems = await utils.reqBackend(axios.get(url))
      this.searchItem.mchItems = this.searchItem.allItems
    },
    onCfmSelClick() {
      this.$router.push({
        path: `/population-statistics/input?type=person&${(new URLSearchParams(this.edtEmployee)).toString()}`
      })
    },
    onSchWdsChanged: utils.onSchWdsChanged
  }
}
</script>

<style lang="scss">
.nml-search .mint-search-list {
  padding-bottom: 55px !important;
}

.sel-search .mint-search-list {
  padding-top: 0 !important;
  top: 84px !important;
  bottom: 53px !important;
}
</style>