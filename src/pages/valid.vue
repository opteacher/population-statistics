<template>
  <div>
    <mt-field id="name" label="姓名" placeholder="请输入姓名" v-model="form.name"
      data-container="body" data-toggle="popover" data-trigger="manual" data-placement="bottom"/>
    <id-card-field :form="form"/>
    <div class="mt-20">
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
import utils from "../utils"
import idCardField from "../comps/idCardField"

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
    onDlgBtnClick(foothold) {
      $("#selHouseOrCompany").modal("hide")
      this.$router.push({path: `/population-statistics/company-detail?${(new URLSearchParams(foothold)).toString()}`})
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

      let url = `/population-statistics/mdl/v1/persons?${(new URLSearchParams(this.form)).toString()}`
      let data = await utils.reqBackend(axios.get(url))
      if (!data || data.length !== 1) {
        utils.popoverErrTip("#name", "未查询到该人员！")
        return false
      }
      this.form = data[0]

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
        this.$router.push({path: `/population-statistics/company-detail?${(new URLSearchParams(this.company)).toString()}`})
      } else if (this.house) {
        this.$router.push({path: `/population-statistics/company-detail?${(new URLSearchParams(this.house)).toString()}`})
      }
    }
  }
}
</script>