<template>
  <div>
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
import {onSchWdsChanged} from "../utils"

export default {
  props: {
    "form": Object
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
      const res = await this.axios.get(`/population-statistics/mdl/v1/persons?lvAddress=${house.address}`)
      if (res.status != 200) {
        Toast({
          message: `系统错误！${res.statusText}`,
          iconClass: "iconfont icon-close-bold"
        })
      } else {
        this.people = res.data.data.map(person => {
          person.id = person.id.toString()
          return person
        })
      }
    },
    async _updateHouses() {
      const res = await this.axios.get("/population-statistics/mdl/v1/companys?shopName===&shopName=")
      if (res.status != 200) {
        Toast({
          message: `系统错误！${res.statusText}`,
          iconClass: "iconfont icon-close-bold"
        })
      } else {
        this.searchHouse.allItems = res.data.data
        this.searchHouse.mchItems = this.searchHouse.allItems
      }
    },
    async _updatePerson() {
      const res = await this.axios.get("/population-statistics/mdl/v1/persons")
      if (res.status != 200) {
        Toast({
          message: `系统错误！${res.statusText}`,
          iconClass: "iconfont icon-close-bold"
        })
      } else {
        this.searchPerson.allItems = res.data.data.map(person => {
          person.id = person.id.toString()
          return person
        })
        this.searchPerson.mchItems = this.searchPerson.allItems
      }
    },
    onSchWdsChanged
  }
}
</script>

<style>
.mint-header-title {
  margin-bottom: 0 !important;
}

.mint-radiolist label {
  margin: 0 !important;
}
</style>
