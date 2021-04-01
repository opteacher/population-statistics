<template>
  <div>
    <mt-navbar v-model="selTab">
      <mt-tab-item id="new">新居民</mt-tab-item>
      <mt-tab-item id="old">老居民</mt-tab-item>
    </mt-navbar>

    <!-- tab-container -->
    <mt-tab-container class="mt-3" v-model="selTab">
      <mt-tab-container-item id="new">
        <id-card-field :form="form"/>
        <mt-field label="姓名" placeholder="请输入姓名" v-model="form.name"/>
        <mt-field label="户籍地址" placeholder="请输入户籍地址（可选）" v-model="form.hhAddress"/>
        <div v-if="form.purpose === 'work'">
          <sch-addr-field :form="form" pname="lvAddress"/>
        </div>
        <div v-else>
          <gender-field :form="form"/>
          <nation-field :form="form"/>
        </div>
      </mt-tab-container-item>
      <mt-tab-container-item id="old">
        <mt-search v-model="searchOldPsn.schWords" :show="true" @input="onSchWdsChanged('searchOldPsn', ['name', 'idCard'])">
          <mt-radio
            align="right"
            v-model="form.idCard"
            :options="searchOldPsn.mchItems.map(person => ({
              label: person.name,
              value: person.idCard
            }))"/>
        </mt-search>
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>

<script>
import idCardField from "./idCardField"
import nationField from "./nationField"
import genderField from "./genderField"
import schAddrField from "./schAddrField"
import {onSchWdsChanged} from "../utils"

export default {
  components: {
    "id-card-field": idCardField,
    "nation-field": nationField,
    "gender-field": genderField,
    "sch-addr-field": schAddrField
  },
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
      }
    }
  },
  watch: {
    "form.idCard": function(n, o) {
      for (let person of this.searchOldPsn.mchItems) {
        if (person.idCard === n) {
          this.form.name = person.name
          this.form.gender = person.gender
          this.form.nation = person.nation
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
  methods: {
    onSchWdsChanged
  }
}
</script>
