<template>
  <div>
    <div>
      <mt-field label="居住地址" placeholder="居住地址（可关键字检索）" v-model="searchAddr.schWords" @input="onSchWdsChanged('searchAddr', ['address'])"/>
    </div>
    <err-popup-tip :error="error" :pname="pname" poppos="right"/>
    <div class="sch-list-panel" :style="`top: ${top}px; bottom: ${bottom}px`">
      <mt-cell v-for="house in searchAddr.mchItems" :title="house.address" :key="house.id"
        is-link @click.native="searchAddr.schWords = house.address"/>
    </div>
  </div>
</template>

<script>
import errPopupTip from "./errPopupTip"
import utils from "../utils"

export default {
  components: {
    "err-popup-tip": errPopupTip
  },
  props: {
    "form": Object,
    "pname": String,
    "error": Object,
    "params": {
      type: String,
      default: ""
    },
    "top": {
      type: Number,
      default: 0
    },
    "bottom": {
      type: Number,
      default: 0
    }
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
    const url = `/population-statistics/mdl/v1/companys${this.params}`
    await utils.reqBackend(axios.get(url), data => {
      this.searchAddr.allItems = data
      this.searchAddr.mchItems = this.searchAddr.allItems
      this.searchAddr.schWords = this.form[this.pname]
    })
  },
  methods: {
    onSchWdsChanged: utils.onSchWdsChanged
  }
}
</script>

<style lang="scss">
.sch-list-panel {
  position: fixed;
  margin-top: 1vh;
  right: 0;
  left: 0;
  overflow-y: scroll;
  z-index: 100;
}
</style>