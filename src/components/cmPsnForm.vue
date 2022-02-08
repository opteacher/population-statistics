<template>
  <div>
    <mt-navbar v-model="selTab">
      <mt-tab-item id="new">新居民</mt-tab-item>
      <mt-tab-item id="old">老居民</mt-tab-item>
    </mt-navbar>

    <!-- tab-container -->
    <mt-tab-container class="mt-3" v-model="selTab">
      <mt-tab-container-item id="new">
        <mt-field
          id="name"
          label="姓名"
          placeholder="请输入姓名"
          v-model="form.name"
          data-container="body"
          data-toggle="popover"
          data-trigger="manual"
          data-placement="bottom"
        />
        <id-card-field :form="form" />
        <mt-field
          id="hhAddress"
          label="户籍地址"
          placeholder="请输入户籍地址（可选）"
          v-model="form.hhAddress"
          data-container="body"
          data-toggle="popover"
          data-trigger="manual"
          data-placement="bottom"
        />
        <gender-field :form="form" />
        <nation-field :form="form" />
      </mt-tab-container-item>
      <mt-tab-container-item id="old">
        <mt-search
          v-model="searchOldPsn.schWords"
          :show="true"
          @input="onSchWdsChanged('searchOldPsn', ['name', 'idCard'])"
        >
          <mt-radio
            align="right"
            v-model="form.idCard"
            :options="
              searchOldPsn.mchItems.map((person) => ({
                label: person.name,
                value: person.idCard,
              }))
            "
          />
        </mt-search>
      </mt-tab-container-item>
    </mt-tab-container>
  </div>
</template>

<script>
import idCardField from './idCardField.vue'
import nationField from './nationField.vue'
import genderField from './genderField.vue'
import * as utils from '../utils.js'

export default {
  components: {
    'id-card-field': idCardField,
    'nation-field': nationField,
    'gender-field': genderField,
  },
  props: {
    form: Object,
  },
  data() {
    return {
      selTab: 'new',
      searchOldPsn: {
        schWords: '',
        allItems: [],
        mchItems: [],
      },
    }
  },
  watch: {
    'form.idCard': function (n, o) {
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
      if (n === 'old') {
        let url = '/population-statistics/mdl/v1/records?type=leave'
        if (this.form.purpose === 'work') {
          url += `&cmpId=${this.form.cmpId}`
        } else {
          url += `&lvAddress=${this.form.lvAddress}`
        }
        const data = await utils.reqBackend(axios.get(url))
        this.searchOldPsn.allItems = data.map((record) => {
          delete record.type
          delete record.purpose
          delete record.psnId
          return record
        })
        this.searchOldPsn.mchItems = this.searchOldPsn.allItems
      }
    },
  },
  methods: {
    onSchWdsChanged: utils.onSchWdsChanged,
  },
}
</script>
