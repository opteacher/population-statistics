<template>
  <div>
    <mt-navbar v-model="selTab">
      <mt-tab-item id="new">新居民</mt-tab-item>
      <mt-tab-item id="old">老居民</mt-tab-item>
    </mt-navbar>

    <!-- tab-container -->
    <mt-tab-container class="mt-3" v-model="selTab">
      <mt-tab-container-item id="new">
        <mt-field label="身份证" placeholder="请输入身份证" v-model="form.idCard" :attr="{ type: 'number', maxlength: 18 }">
          <mt-button disabled size="small">
            <i class="iconfont icon-camera"/>
          </mt-button>
        </mt-field>
        <mt-field label="姓名" placeholder="请输入姓名" v-model="form.name"/>
        <mt-field label="户籍地址" placeholder="请输入户籍地址（可选）" v-model="form.hhAddress"/>
        <div v-if="form.purpose === 'work'">
          <mt-field label="居住地址" placeholder="居住地址" v-model="form.lvAddress"/>
          <div class="sch-houses-panel">
            <div class="h-100">
              <mt-cell v-for="house in schHouses"
                :title="house.address"
                :key="house.id"
                is-link @click.native="onHouseLnkClick(house.address)"/>
            </div>
          </div>
        </div>
      </mt-tab-container-item>
      <mt-tab-container-item id="old">
        <mt-search v-model="searchOldPsn.schWords" :show="true" @input="onSchWdsChanged('searchOldPsn', ['name', 'idCard'])">
          <mt-radio
            align="right"
            v-model="form.idCard"
            :options="searchOldPsn.mchItems.map(person => ({
              label: `${person.name} (${person.idCard})`,
              value: person.idCard
            }))"/>
        </mt-search>
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>

<script>
export default {
  props: {
    "form": Object
  },
  data() {
    return {
      selTab: "new",
      searchOldPsn: {
        schWords: "",
        allItems: [],
        mchItems: []
      },
      houses: [],
      schHouses: []
    }
  },
  watch: {
    "form.lvAddress": function(n, o) {
      if (!n) {
        this.schHouses = this.houses
        return
      }
      this.schHouses = []
      for (let house of this.houses) {
        if (house.address.includes(n)) {
          this.schHouses.push(house)
        }
      }
    },
    "form.idCard": function(n, o) {
      for (let person of this.searchOldPsn.mchItems) {
        if (person.idCard === n) {
          this.form.name = person.name
          this.form.phone = person.phone
          this.form.hhAddress = person.hhAddress
          this.form.lvAddress = person.lvAddress
          this.form.cmpId = person.cmpId
          this.form.company = person.company
          break
        }
      }
    },
    async selTab(n, o) {
      if (n === "old") {
        const res = await this.axios.get("/population-statistics/mdl/v1/records?type=leave")
        if (res.status != 200) {
          Toast({
            message: `系统错误！${res.statusText}`,
            iconClass: "iconfont icon-close-bold"
          })
        } else {
          this.searchOldPsn.allItems = res.data.data.map(record => {
            delete record.type
            delete record.purpose
            delete record.psnId
            return record
          })
          this.searchOldPsn.mchItems = this.searchOldPsn.allItems
        }
      }
    }
  },
  async created() {
    if (this.form.purpose === "work") {
      const res = await this.axios.get("/population-statistics/mdl/v1/companys")
      if (res.status != 200) {
        Toast({
          message: `系统错误！${res.statusText}`,
          iconClass: "iconfont icon-close-bold"
        })
      } else {
        this.houses = res.data.data
        this.schHouses = this.houses
      }
    }
  },
  methods: {
    onHouseLnkClick(address) {
      this.form.lvAddress = address
    },
    onSchWdsChanged(schInfo, incProps) {
      if (!this[schInfo].schWords) {
        this[schInfo].mchItems = this[schInfo].allItems
      } else {
        this[schInfo].mchItems = []
        this[schInfo].allItems.map(item => {
          for (let incProp of incProps) {
            if (item[incProp].includes(this[schInfo].schWords)) {
              this[schInfo].mchItems.push(item)
              break
            }
          }
        })
      }
    },
  }
}
</script>

<style lang="scss">
.sch-houses-panel {
  position: fixed;
  margin-top: 1vh;
  right: 0;
  left: 0;
  top: 301px;
  bottom: 60px;
  overflow-y: scroll
}
</style>
