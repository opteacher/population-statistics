<template>
  <div>
    <mt-cell class="sel-person mb-1pc" title="离开人员">
      {{form.name || "请选择将要离开此地的人员"}}
    </mt-cell>
    <err-popup-tip :error="error" pname="psnId"/>

    <mt-navbar v-model="selTab">
      <mt-tab-item id="house">所在房屋</mt-tab-item>
      <mt-tab-item id="person">个人信息</mt-tab-item>
    </mt-navbar>

    <!-- tab-container -->
    <mt-tab-container class="mt-3" v-model="selTab">
      <mt-tab-container-item id="house">
        <div v-if="!houseDetail">
          <mt-search v-model="searchHouse.schWords" :show="true" @input="onSchWdsChanged('searchHouse', ['address'])">
            <mt-cell v-for="house in searchHouse.mchItems"
              :title="house.address"
              :key="house.id"
              @click.native="onHsDetailClick(house)"
              is-link/>
          </mt-search>
        </div>
        <div v-else>
          <mt-header :title="houseDetail.address">
            <mt-button icon="back" slot="left" @click="houseDetail = null">返回</mt-button>
          </mt-header>
          <mt-radio
            v-model="selPsnId"
            :options="people.map(person => ({
              label: person.name,
              value: person.id
            }))"/>
        </div>
      </mt-tab-container-item>
      <mt-tab-container-item id="person">
        <mt-search v-model="searchPerson.schWords" :show="true" @input="onSchWdsChanged('searchPerson', ['name', 'idCard', 'phone'])">
          <mt-radio
            align="right"
            v-model="selPsnId"
            :options="searchPerson.mchItems.map(person => ({
              label: person.name,
              value: person.id
            }))"/>
        </mt-search>
      </mt-tab-container-item>
    </mt-tab-container>
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
    "error": Object
  },
  data() {
    return {
      selTab: "house",
      houseDetail: null,
      searchHouse: {
        schWords: "",
        allItems: [],
        mchItems: []
      },
      searchPerson: {
        schWords: "",
        allItems: [],
        mchItems: []
      },
      selPsnId: "",
      people: []
    }
  },
  watch: {
    selPsnId(n, o) {
      for (let person of this.selTab === "house" ? this.people : this.searchPerson.mchItems) {
        if (person.id === n) {
          this.form.psnId = parseInt(person.id)
          this.form.name = person.name
          this.form.idCard = person.idCard
          this.form.phone = person.phone
          this.form.hhAddress = person.hhAddress
          this.form.lvAddress = person.lvAddress
          this.form.cmpId = person.cmpId
          this.form.company = person.company
          break
        }
      }
    }
  },
  created() {
    this._updateHouses()
    this._updatePerson()
  },
  methods: {
    async onHsDetailClick(house) {
      this.houseDetail = house
      const url = `/population-statistics/mdl/v1/persons?lvAddress=${house.address}`
      await utils.reqBackend(this.axios.get(url), data => {
        this.people = data.map(person => {
          person.id = person.id.toString()
          return person
        })
      })
    },
    async _updateHouses() {
      const url = "/population-statistics/mdl/v1/companys?shopName===&shopName="
      await utils.reqBackend(this.axios.get(url), data => {
        this.searchHouse.allItems = data
        this.searchHouse.mchItems = this.searchHouse.allItems
      })
    },
    async _updatePerson() {
      const url = "/population-statistics/mdl/v1/persons"
      await utils.reqBackend(this.axios.get(url), data => {
        this.searchPerson.allItems = data.map(person => {
          person.id = person.id.toString()
          return person
        })
        this.searchPerson.mchItems = this.searchPerson.allItems
      })
    },
    onSchWdsChanged: utils.onSchWdsChanged
  }
}
</script>

<style>
.sel-person {
  left: 0;
  right: 0;
  z-index: 100
}

.mint-header-title {
  margin-bottom: 0 !important;
}

.mint-radiolist label {
  margin: 0 !important;
}
</style>
