<template>
  <div>
    <mt-cell class="sel-house" :title="isForWork ? '工作单位' : '居住房屋'">
      {{(isForWork ? form.company : form.lvAddress) || `请选择${isForWork ? '单位' : '房屋'}`}}
    </mt-cell>
    <mt-search v-model="searchHouse.schWords"
      :show="true" @input="onSchWdsChanged('searchHouse', ['name', 'shopName', 'address'])">
      <err-popup-tip :error="error" :pname="isForWork ? 'cmpId' : 'lvAddress'"/>
      <div class="sel-house-list" :style="`top: ${this.top}px`">
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
import errPopupTip from "./errPopupTip"
import utils from "../utils"

export default {
  components: {
    "err-popup-tip": errPopupTip
  },
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
    await utils.reqBackend(axios.get(url), data => {
      this.searchHouse.allItems = data.map(house => {
        house.id = house.id.toString()
        return house
      })
      this.searchHouse.mchItems = this.searchHouse.allItems
    })
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

.sel-house-list {
  overflow-y: scroll;
  position: fixed;
  bottom: 61px;
  left: 0;
  right: 0;
}
</style>
