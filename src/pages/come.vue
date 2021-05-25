<template>
  <div>
    <steps-header-bar :stepArr="steps" :active="curStep"/>
    <div style="position: absolute; top: 60px; bottom: 61px; left: 0; right: 0">
      <purpose-form v-if="curStep === 0" :form="form"/>
      <house-form v-if="curStep === 1" :form="form"/>
      <cm-psn-form v-if="curStep === 2" :form="form"/>
      <connect-form v-if="curStep === 3" :form="form"/>
      <confirm-form v-if="curStep === 4" :form="form"/>
    </div>
    <div class="fixed-bottom" style="padding: 10px 5px; background-color: transparent">
      <mt-button v-if="curStep !== 0" type="default" @click="onStepBtnClick(-1)">上一步</mt-button>
      <mt-button v-if="curStep !== 4" class="float-right" type="primary" @click="onStepBtnClick(1)">下一步</mt-button>
      <mt-button v-else class="float-right" :disable="formSubmit" type="primary" @click="onFinishBtnClick">
        <mt-spinner v-if="formSubmit" type="snake" slot="icon" color="white"/>
        完成
      </mt-button>
    </div>
  </div>
</template>

<script>
import stepsHeaderBar from "../comps/stepsHeaderBar"
import purposeForm from "../comps/purposeForm"
import cmPsnForm from "../comps/cmPsnForm"
import houseForm from "../comps/houseForm"
import connectForm from "../comps/connectForm"
import confirmForm from "../comps/confirmForm"
import { MessageBox, Toast } from "mint-ui"
import utils from "../utils"

export default {
  components: {
    "steps-header-bar": stepsHeaderBar,
    "purpose-form": purposeForm,
    "cm-psn-form": cmPsnForm,
    "house-form": houseForm,
    "connect-form": connectForm,
    "confirm-form": confirmForm
  },
  data() {
    return {
      steps: ["目的", "住宅", "人员", "联系", "确认"],
      curStep: 0,
      form: {
        type: "come",
        idCard: "",
        name: "",
        gender: "男",
        nation: "汉族",
        lvAddress: "",
        hhAddress: "",
        hasLvCard: false,
        purpose: "",
        purposeCn: "",
        cmpId: "",
        company: "",
        phone: "",
        passed: false
      },
      formSubmit: false
    }
  },
  methods: {
    _validFormData() {
      switch (this.curStep) {
        case 0:
          if (this.form.purpose === "") {
            utils.popoverErrTip("#purpose", "必须选择来此目的！")
            return false
          } else if (this.form.purpose === "work" && this.form.cmpId === "") {
            utils.popoverErrTip("#cmpId", "必须选择工作单位！")
            return false
          }
          break
        case 1:
          if (this.form.lvAddress === "") {
            utils.popoverErrTip("#lvAddress", "必须选择现在居住地址！")
            return false
          }
          break
        case 2:
          if (this.form.name === "") {
            utils.popoverErrTip("#name", "必须填写人员姓名！")
            return false
          } else if (!utils.PsnNameRegexp.test(this.form.name)) {
            utils.popoverErrTip("#name", "必须填写正确的人员姓名！")
            return false
          } else if (this.form.idCard === "") {
            utils.popoverErrTip("#idCard", "必须填写身份证号码！")
            return false
          } else if (!utils.IdCardRegexp.test(this.form.idCard)) {
            utils.popoverErrTip("#idCard", "必须填写正确的身份证号码！")
            return false
          }
          break
        case 3:
          if (this.form.phone === "") {
            utils.popoverErrTip("#phone", "必须填写联系电话！")
            return false
          } else if (!utils.PhoneRegexp.test(this.form.phone)) {
            utils.popoverErrTip("#phone", "必须填写正确联系电话！")
            return false
          }
          break
      }
      return true
    },
    onStepBtnClick(idx) {
      if (idx === 1 && !this._validFormData()) {
        return
      }
      this.curStep += idx
    },
    onFinishBtnClick() {
      // 正式提交
      this.formSubmit = true
      MessageBox({
        title: "提示",
        message: "确认该人员来访/居住/工作?",
        showCancelButton: true
      }).then(async action => {
        if (action !== "confirm") {
          this.formSubmit = false
          return
        }
        if (this.form.cmpId === "") {
          delete this.form.cmpId
          delete this.form.company
        } else if (typeof this.form.cmpId === "string") {
          this.form.cmpId = parseInt(this.form.cmpId)
        }
        const url = "/population-statistics/mdl/v1/record"
        await utils.reqBackend(axios.post(url, this.form))
        Toast({
          message: "来登成功！请等待协管核实",
          iconClass: "iconfont icon-select-bold fs-50"
        })
        this.$router.push({path: "/"})
      })
    }
  }
}
</script>
