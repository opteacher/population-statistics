<template>
  <div style="overflow: hidden">
    <ul class="nav nav-pills nav-fill nav-header">
      <li class="nav-item">
        <a class="nav-link" :class="{'active': curStep === 'purpose', 'disabled': !stepOrder['purpose']}" v-on:click="curStep = 'purpose'">来此目的</a>
      </li>
      <i class="iconfont icon-arrow-right icon-align-middle"/>
      <li class="nav-item">
        <a class="nav-link" :class="{'active': curStep === 'person', 'disabled': !stepOrder['person']}" v-on:click="curStep = 'person'">人员</a>
      </li>
      <i class="iconfont icon-arrow-right icon-align-middle"/>
      <li class="nav-item">
        <a class="nav-link" :class="{'active': curStep === 'house', 'disabled': !stepOrder['house']}" v-on:click="curStep = 'house'">
          {{form.purpose === "work" ? "单位" : "住宅"}}
        </a>
      </li>
      <i class="iconfont icon-arrow-right icon-align-middle"/>
      <li class="nav-item">
        <a class="nav-link" :class="{'active': curStep === 'connect', 'disabled': !stepOrder['connect']}" v-on:click="curStep = 'connect'">联系方式</a>
      </li>
    </ul>
    <div style="position: absolute; top: 60px; left: 0; right: 0">
      <purpose-form v-if="curStep === 'purpose'" :form="form" :error="error"/>
      <cm-psn-form v-if="curStep === 'person'" :form="form" :error="error"/>
      <house-form v-if="curStep === 'house'" :form="form" :error="error"/>
      <connect-form v-if="curStep === 'connect'" :form="form" :error="error"/>
    </div>
    <div class="fixed-bottom" style="padding: 10px 5px; background-color: white">
      <mt-button v-if="curStep !== 'purpose'" type="default" @click="onStepBtnClick(-1)">上一步</mt-button>
      <mt-button v-if="curStep !== 'connect'" class="float-right" type="primary" @click="onStepBtnClick(1)">下一步</mt-button>
      <mt-button v-else class="float-right" :disable="formSubmit" type="primary" @click="onFinishBtnClick">
        <mt-spinner v-if="formSubmit" type="snake" slot="icon" color="white"/>
        完成
      </mt-button>
    </div>
  </div>
</template>

<script>
import purposeForm from "../comps/purposeForm"
import cmPsnForm from "../comps/cmPsnForm"
import houseForm from "../comps/houseForm"
import connectForm from "../comps/connectForm"
import { MessageBox, Toast } from "mint-ui"
import utils from "../utils"

export default {
  components: {
    "purpose-form": purposeForm,
    "cm-psn-form": cmPsnForm,
    "house-form": houseForm,
    "connect-form": connectForm
  },
  data() {
    return {
      stepOrder: {
        "purpose": false,
        "person": false,
        "house": false,
        "connect": false
      },
      curStep: "purpose",
      form: {
        type: "come",
        idCard: "",
        name: "",
        gender: "男",
        nation: "汉族",
        lvAddress: "",
        hhAddress: "",
        purpose: "",
        purposeCn: "",
        cmpId: "",
        company: "",
        phone: "",
        passed: false
      },
      error: {
        active: false,
        pname: "",
        message: ""
      },
      formSubmit: false
    }
  },
  methods: {
    _validFormData() {
      switch (this.curStep) {
        case "purpose":
          if (this.form.purpose === "") {
            this.error.pname = "purpose"
            this.error.message = "必须选择来此目的！"
            this.error.active = true
            return false
          }
          break
        case "person":
          if (this.form.idCard === "") {
            this.error.pname = "idCard"
            this.error.message = "必须填写身份证号码！"
            this.error.active = true
            return false
          } else if (this.form.name === "") {
            this.error.pname = "name"
            this.error.message = "必须填写人员姓名！"
            this.error.active = true
            return false
          } else if (this.form.purpose === "work" && this.form.lvAddress === "") {
            this.error.pname = "lvAddress"
            this.error.message = "必须填写现在居住地址！"
            this.error.active = true
            return false
          }
          break
        case "house":
          if (this.form.purpose === "work" && this.form.cmpId === "") {
            this.error.pname = "cmpId"
            this.error.message = "必须选择工作单位！"
            this.error.active = true
            return false
          } else if (this.form.purpose === "live" && this.form.lvAddress === "") {
            this.error.pname = "lvAddress"
            this.error.message = "必须选择现在居住地址！"
            this.error.active = true
            return false
          }
          break
        case "connect":
          // 联系电话在完成逻辑中检测
          break
      }
      return true
    },
    onStepBtnClick(idx) {
      const stepOrderKeys = Object.keys(this.stepOrder)
      const nxtIdx = stepOrderKeys.indexOf(this.curStep) + idx
      if (nxtIdx === -1 || nxtIdx === this.stepOrder.length) {
        return
      }
      if (idx === 1) {
        if (!this._validFormData()) {
          return
        }
        this.stepOrder[this.curStep] = true
      }
      this.curStep = stepOrderKeys[nxtIdx]
    },
    onFinishBtnClick() {
      // 最后检查联系电话是否正确
      if (this.form.phone === "") {
        this.error.pname = "phone"
        this.error.message = "必须填写联系电话！"
        this.error.active = true
        return
      }

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
        await utils.reqBackend(this.axios.post(url, this.form), data => {
          Toast({
            message: "来登成功！请等待协管核实",
            iconClass: "iconfont icon-select-bold"
          })
          this.$router.go(-1)
        })
      })
    }
  }
}
</script>

<style lang="scss">
.icon-align-middle::before {
  position: relative;
  top: 8px;
}

.nav-item a {
  padding-left: 0;
  padding-right: 0;
}
</style>