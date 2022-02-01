<template>
  <div>
    <mt-field id="lvAddress" label="居住地址" placeholder="居住地址（可关键字检索）"
      v-model="searchAddr.schWords" @input="onSchWdsChanged('searchAddr', ['address'])"
      data-container="body" data-toggle="popover" data-trigger="manual" data-placement="top"
    />
    <div class="sch-list-panel"
      :style="`top: ${top}px; bottom: ${bottom}px; ${hasBtmMgn ? 'margin-bottom: 1vh' : ''}`"
    >
      <mt-cell v-for="house in searchAddr.mchItems" :title="house.address" :key="house.id"
        is-link @click.native="searchAddr.schWords = house.address"
      />
    </div>
  </div>
</template>

<script>
import * as utils from "../utils.js"

export default {
  props: {
    "form": Object,
    "pname": String,
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
    },
    hasBtmMgn: {
      type: Boolean,
      default: false
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
    this.searchAddr.allItems = await utils.reqBackend(axios.get(url))
    this.searchAddr.mchItems = this.searchAddr.allItems
    this.searchAddr.schWords = this.form[this.pname]
  },
  methods: {
    onSchWdsChanged: utils.onSchWdsChanged
  }
}
</script>

<style lang="less">
.sch-list-panel {
  position: fixed;
  margin-top: 1vh;
  right: 0;
  left: 0;
  overflow-y: scroll;
  z-index: 100;
}
</style>
