<template>
  <div>
    <mt-header fixed title="登录查看人员信息"/>
    <div style="margin-top: 40px">
      <mt-field id="name" label="姓名" placeholder="请输入姓名" v-model="form.name"
        data-container="body" data-toggle="popover" data-trigger="manual" data-placement="bottom"/>
      <id-card-field :form="form"/>
    </div>
    <div class="mt-5">
      <mt-button type="primary w-98 mlr-1pc" @click="onConfirmClick">确认身份</mt-button>
    </div>
    <div id="selHouseOrCompany" class="modal" tabindex="-1">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-body">
            <button type="button" class="w-100 btn btn-success" @click="onDlgBtnClick(house)">居住房屋</button>
            <button type="button" class="w-100 btn btn-info mt-10" @click="onDlgBtnClick(company)">工作单位</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import "url"
import * as utils from "../utils.js"
import cookies from "../cookies.js"
import idCardField from "../comps/idCardField.vue"

export default {
  components: {
    "id-card-field": idCardField
  },
  data() {
    return {
      form: {
        name: "",
        idCard: ""
      },
      company: null,
      house: null,
      URLSearchParams
    }
  },
  methods: {
    async onDlgBtnClick(foothold) {
      $("#selHouseOrCompany").modal("hide")
      this.$router.push({path: `/company-detail?${this._cmbParams(foothold)}&uneditable=true`})
    },
    async onConfirmClick() {
      if (this.form.name === "") {
        utils.popoverErrTip("#name", "必须填写人员姓名！")
        return
      } else if (!utils.PsnNameRegexp.test(this.form.name)) {
        utils.popoverErrTip("#name", "必须填写正确的人员姓名！")
        return
      } else if (this.form.idCard === "") {
        utils.popoverErrTip("#idCard", "必须填写身份证号码！")
        return
      } else if (!utils.IdCardRegexp.test(this.form.idCard)) {
        utils.popoverErrTip("#idCard", "必须填写正确的身份证号码！")
        return
      }

      let url = "/population-statistics/api/v1/person/sign/in"
      let data = await utils.reqBackend(axios.post(url, {
        name: this.form.name,
        idCard: this.form.idCard
      }), res => {
        if (!res.data.data) {
          utils.popoverErrTip("#name", res.data.message)
          return
        }
        cookies.set("personTkn", res.headers.authorization)
      })
      if (!data) {
        return
      }
      this.form = data

      url = "/population-statistics/mdl/v1/companys?shopName===&shopName="
      data = await utils.reqBackend(axios.get(url))
      const houses = data.map(item => item.address)

      this.company = null
      if (this.form.cmpId) {
        url = `/population-statistics/mdl/v1/company/${this.form.cmpId}`
        data = await utils.reqBackend(axios.get(url))
        this.company = data[0]
      }
      this.house = null
      if (houses.includes(this.form.lvAddress)) {
        url = `/population-statistics/mdl/v1/companys?address=${this.form.lvAddress}`
        data = await utils.reqBackend(axios.get(url))
        this.house = data[0]
      }

      if (this.company && this.house) {
        $("#selHouseOrCompany").modal("show")
      } else if (this.company) {
        this.onDlgBtnClick(this.company)
      } else if (this.house) {
        this.onDlgBtnClick(this.house)
      }
    },
    _cmbParams(foothold) {
      return (new URLSearchParams(Object.assign(foothold, {
        submit: this.form.name,
        sbtIdCard: this.form.idCard,
        sbtPhone: this.form.phone
      }))).toString()
    }
  }
}
</script>
