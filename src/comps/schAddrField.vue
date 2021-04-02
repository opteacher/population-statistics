<template>
  <div>
    <mt-field label="居住地址" placeholder="居住地址" v-model="searchAddr.schWords" @input="onSchWdsChanged('searchAddr', ['address'])"/>
    <err-popup-tip :error="error" :pname="pname" poppos="top"/>
    <div class="sch-list-panel">
      <mt-cell v-for="house in searchAddr.mchItems"
        :title="house.address"
        :key="house.id"
        is-link @click.native="searchAddr.schWords = house.address"/>
    </div>
  </div>
</template>

<script>
import errPopupTip from "./errPopupTip"
import {onSchWdsChanged} from "../utils"

export default {
  components: {
    "err-popup-tip": errPopupTip
  },
  props: {
    "form": Object,
    "pname": String,
    "error": Object
  },
  data() {
    return {
      searchAddr: {
        schWords: "",
        allItems: [],
        mchItems: []
      }
    }
  },
  watch: {
    "searchAddr.schWords": function(n, o) {
      this.form[this.pname] = n
    }
  },
  async created() {
    const res = await this.axios.get(`/population-statistics/mdl/v1/companys${this.urlParams || ''}`)
    if (res.status != 200) {
      Toast({
        message: `系统错误！${res.statusText}`,
        iconClass: "iconfont icon-close-bold"
      })
    } else {
      this.searchAddr.allItems = res.data.data
      this.searchAddr.mchItems = this.searchAddr.allItems
      this.searchAddr.schWords = this.form[this.pname]
    }
  },
  methods: {
    onSchWdsChanged
  }
}
</script>

<style lang="scss">
.sch-list-panel {
  position: fixed;
  margin-top: 1vh;
  right: 0;
  left: 0;
  top: 301px;
  bottom: 60px;
  overflow-y: scroll;
  z-index: 100;
}
</style>