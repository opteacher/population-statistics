<template>
  <div>
    <div>
      <mt-field id="name" label="代办人姓名" placeholder="请输入姓名" v-model="form.name"
        data-container="body" data-toggle="popover" data-trigger="manual" data-placement="bottom">
        <mt-button size="small" @click="onInforBtnClick">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#icon-tishi"></use>
          </svg>
        </mt-button>
      </mt-field>
      <id-card-field label="代办人身份证" :form="form"/>
      <mt-cell title="代办人与离此人员关系" :value="form.relation"
        is-link @click.native="form.relation = form.relation === '同工' ? '同住' : '同工'"/>
      <mt-cell id="cmpId_lvAddr" :title="form.relation === '同工' ? '工作单位' : '居住房屋'"
        :value="form.relation === '同工' ? (form.company || '请选择单位') : (form.lvAddress || '请选择房屋')"
        data-container="body" data-toggle="popover" data-trigger="manual" data-placement="bottom"/>
    </div>
    <mt-search class="foothold-search" v-model="schFoothold.schWords" :show="true" @input="onSchWdsChanged('schFoothold', ['label'])">
      <div class="scroll-panel" style="top: 293px; bottom: 61px">
        <mt-radio v-model="selRadio" :options="schFoothold.mchItems"/>
      </div>
    </mt-search>
  </div>
</template>

<script>
import idCardField from "./idCardField"
import utils from "../utils"
import { MessageBox } from "mint-ui"

export default {
  components: {
    "id-card-field": idCardField,
  },
  props: {
    "form": Object
  },
  data() {
    return {
      tip: "代办人可代替将离开此地的人员申报相关信息，现暂定为同住一屋或者共同工作的人员可代办该业务，代办人需提供自己真实的姓名、身份证以及住址/单位。如自身就是将离开此地的人员，代办人填写自身信息即可。",
      houses: [],
      companies: [],
      selRadio: "",
      schFoothold: {
        schWords: "",
        allItems: [],
        mchItems: []
      }
    }
  },
  watch: {
    "selRadio": function(n, o) {
      if (this.form.relation === "同工") {
        this.form.cmpId = parseInt(n)
        for (let company of this.companies) {
          if (company.value === n) {
            this.form.company = company.label
            break
          }
        }
      } else {
        this.form.lvAddress = n
      }
    },
    "form.relation": function(n, o) {
      this.selRadio = ""
      this.form.cmpId = -1
      this.form.company = ""
      this.form.lvAddress = ""
      this.schFoothold.schWords = ""
      this.schFoothold.allItems = n === '同工' ? this.companies : this.houses
      this.schFoothold.mchItems = this.schFoothold.allItems
    }
  },
  created() {
    MessageBox("提示", this.tip).then(async () => {
      const data = await utils.reqBackend([
        axios.get("/population-statistics/mdl/v1/companys?shopName=!=&shopName="), // 单位
        axios.get("/population-statistics/mdl/v1/companys?shopName===&shopName="), // 房屋
      ])
      this.companies = data[0].map(item => ({
        label: item.shopName,
        value: item.id.toString()
      }))
      this.houses = data[1].map(item => ({
        label: item.address,
        value: item.address
      }))
      this.schFoothold.allItems = this.form.relation === '同工' ? this.companies : this.houses
      this.schFoothold.mchItems = this.schFoothold.allItems
    })
  },
  methods: {
    async onNextBtnClick() {
      let url = `/population-statistics/mdl/v1/persons?name=${this.form.name}&idCard=${this.form.idCard}`
      url += this.form.relation === "同工" ? `&cmpId=${this.form.cmpId}` : `&lvAddress=${this.form.lvAddress}`
      const data = await utils.reqBackend(axios.get(url))
      if (!data || data.length !== 1) {
        return Promise.resolve(false)
      }
      const sbtPerson = data[0]
      this.form.psnId = sbtPerson.id
      this.form.submit = sbtPerson.name
      this.form.phone = sbtPerson.phone
      return Promise.resolve(true)
    },
    onInforBtnClick() {
      MessageBox("提示", this.tip)
    },
    onSchWdsChanged: utils.onSchWdsChanged
  }
}
</script>

<style lang="less">
.foothold-search .mint-search-list {
  padding-top: 0 !important;
  height: 0 !important;
}
</style>
