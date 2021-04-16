<template>
  <div>
    <mt-cell id="cmpId_lvAddr" class="sel-house" :title="isForWork ? '工作单位' : '居住房屋'"
      data-container="body" data-toggle="popover" data-trigger="manual" data-placement="bottom">

      {{(isForWork ? form.company : form.lvAddress) || `请选择${isForWork ? '单位' : '房屋'}`}}
    </mt-cell>
    <mt-search v-model="searchHouse.schWords"
      :show="true" @input="onSchWdsChanged('searchHouse', ['name', 'shopName', 'address'])">
      <div class="scroll-panel" :style="`top: ${this.top}px; bottom: 61px`">
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
      </div>
    </mt-search>
  </div>
</template>

<script>
import utils from "../utils"

export default {
  props: {
    "form": Object,
    "error": Object,
    "purpose": {
      type: String,
      default: ""
    },
    "top": {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      isForWork: false,
      selected: false,
      searchHouse: {
        schWords: "",
        allItems: [],
        mchItems: []
      }
    }
  },
  watch: {
    "form.cmpId": function(n, o) {
      this.selected = Boolean(this.form.cmpId)
      for (let comp of this.searchHouse.mchItems) {
        if (comp.id === n) {
          this.form.company = comp.shopName
        }
      }
    },
    "form.lvAddress": function(n, o) {
      this.selected = Boolean(this.form.lvAddress)
    }
  },
  async created() {
    this.isForWork = this.purpose ? this.purpose === "work" : this.form.purpose === "work"
    const url = `/population-statistics/mdl/v1/companys?shopName=${this.isForWork ? '!' : '='}=&shopName=`
    const data = await utils.reqBackend(axios.get(url))
    this.searchHouse.allItems = data.map(house => {
      house.id = house.id.toString()
      return house
    })
    this.searchHouse.mchItems = this.searchHouse.allItems
  },
  methods: {
    onSchWdsChanged: utils.onSchWdsChanged
  }
}
</script>

<style lang="scss">
.sel-house {
  position: relative;
  left: 0;
  right: 0;
  z-index: 100
}
</style>
