<template>
  <div>
    <mt-cell
      id="purpose"
      title="来此地目的"
      label="半工作半居住的请选择工作"
      :value="form.purposeCn || '请选择'"
      is-link
      @click.native="selHouseTypeVisible = true"
      data-container="body"
      data-toggle="popover"
      data-trigger="manual"
      data-placement="bottom"
    />
    <mt-actionsheet :actions="houseTypes" v-model="selHouseTypeVisible" />
    <div v-if="form.purpose === 'work'">
      <mt-cell
        id="cmpId"
        class="sel-house"
        title="工作单位"
        data-container="body"
        data-toggle="popover"
        data-trigger="manual"
        data-placement="bottom"
        >{{ form.company || '请选择单位' }}</mt-cell
      >
      <mt-search
        class="search-company"
        v-model="searchCompany.schWords"
        :show="true"
        @input="
          onSchWdsChanged('searchCompany', ['name', 'shopName', 'address'])
        "
      >
        <div class="scroll-panel" style="top: 200px; bottom: 61px">
          <mt-radio
            align="right"
            v-model="form.cmpId"
            :options="
              searchCompany.mchItems.map((company) => ({
                label: company.shopName || company.name,
                value: company.id,
              }))
            "
          />
        </div>
      </mt-search>
    </div>
  </div>
</template>

<script>
import * as utils from '../utils.js'

export default {
  props: {
    form: Object,
  },
  data() {
    return {
      selHouseTypeVisible: false,
      houseTypes: [
        {
          name: '居住',
          method: () => {
            this.form.purpose = 'live'
            this.form.purposeCn = '居住'
          },
        },
        {
          name: '工作',
          method: () => {
            this.form.purpose = 'work'
            this.form.purposeCn = '工作'
          },
        },
      ],
      searchCompany: {
        schWords: '',
        allItems: [],
        mchItems: [],
      },
    }
  },
  watch: {
    'form.cmpId': function (n, o) {
      for (let comp of this.searchCompany.mchItems) {
        if (comp.id === n) {
          this.form.company = comp.shopName
        }
      }
    },
  },
  async created() {
    const url = '/population-statistics/mdl/v1/company/s?shopName=!=&shopName='
    const data = await utils.reqBackend(axios.get(url))
    this.searchCompany.allItems = data.map((company) => {
      company.id = company.id.toString()
      return company
    })
    this.searchCompany.mchItems = this.searchCompany.allItems
  },
  methods: {
    onSchWdsChanged: utils.onSchWdsChanged,
  },
}
</script>

<style>
.search-company .mint-search-list {
  top: 96px !important;
}
</style>
