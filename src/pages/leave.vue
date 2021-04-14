<template>
  <div>
    <ul class="nav nav-pills nav-fill nav-header">
      <li class="nav-item">
        <a class="nav-link" :class="{'active': curStep === 'agent', 'disabled': !stepOrder['agent']}" v-on:click="curStep = 'agent'">代办</a>
      </li>
      <i class="iconfont icon-arrow-right icon-align-middle"/>
      <li class="nav-item">
        <a class="nav-link" :class="{'active': curStep === 'person', 'disabled': !stepOrder['person']}" v-on:click="curStep = 'person'">人员</a>
      </li>
      <i class="iconfont icon-arrow-right icon-align-middle"/>
      <li class="nav-item">
        <a class="nav-link" :class="{'active': curStep === 'whereto', 'disabled': !stepOrder['whereto']}" v-on:click="curStep = 'whereto'">去向</a>
      </li>
      <i class="iconfont icon-arrow-right icon-align-middle"/>
      <li class="nav-item">
        <a class="nav-link" :class="{'active': curStep === 'connect', 'disabled': !stepOrder['connect']}" v-on:click="curStep = 'connect'">联系</a>
      </li>
      <i class="iconfont icon-arrow-right icon-align-middle"/>
      <li class="nav-item">
        <a class="nav-link" :class="{'active': curStep === 'confirm', 'disabled': !stepOrder['confirm']}" v-on:click="curStep = 'confirm'">确认</a>
      </li>
    </ul>
    <div style="overflow: hidden; position: absolute; top: 60px; bottom: 61px; left: 0; right: 0">
      <agent-form ref="agent-form" v-if="curStep === 'agent'" :form="form"/>
      <lv-psn-form v-if="curStep === 'person'" :form="form"/>
      <where-to-form v-if="curStep === 'whereto'" :form="form"/>
      <connect-form v-if="curStep === 'connect'" :form="form"/>
      <confirm-form v-if="curStep === 'confirm'" :form="form"/>
    </div>
    <div class="fixed-bottom" style="padding: 10px 5px; background-color: transparent">
      <mt-button v-if="curStep !== 'agent'" type="default" @click="onStepBtnClick(-1)">上一步</mt-button>
      <mt-button v-if="curStep !== 'confirm'" class="float-right" type="primary" @click="onStepBtnClick(1)">下一步</mt-button>
      <mt-button v-else class="float-right" :disable="formSubmit" type="primary" @click="onFinishBtnClick">
        <mt-spinner v-if="formSubmit" type="snake" slot="icon" color="white"/>完成
      </mt-button>
    </div>
  </div>
</template>

<script>
import agentForm from "../comps/agentForm"
import lvPsnForm from "../comps/lvPsnForm"
import whereToForm from "../comps/whereToForm"
import connectForm from "../comps/connectForm"
import confirmForm from "../comps/confirmForm"
import { MessageBox, Toast } from "mint-ui"
import utils from "../utils"

export default {
  components: {
    "agent-form": agentForm,
    "lv-psn-form": lvPsnForm,
    "where-to-form": whereToForm,
    "connect-form": connectForm,
    "confirm-form": confirmForm
  },
  data() {
    return {
      curStep: "agent",
      stepOrder: {
        "agent": false,
        "person": false,
        "whereto": false,
        "connect": false,
        "confirm": false
      },
      form: {
        type: "leave",
        purpose: "",
        psnId: -1,
        name: "",
        idCard: "",
        gender: "男",
        nation: "汉族",
        phone: "",
        hhAddress: "",
        lvAddress: "",
        toAddress: "",
        cmpId: "",
        company: "",
        passed: false,
        relation: "同工"
      },
      formSubmit: false
    }
  },
  methods: {
    async _validFormData() {
      switch (this.curStep) {
        case "agent":
          if (this.form.name === "") {
            utils.popoverErrTip("#name", "必须填写人员姓名！")
            return Promise.resolve(false)
          } else if (!utils.PsnNameRegexp.test(this.form.name)) {
            utils.popoverErrTip("#name", "必须填写正确的人员姓名！")
            return Promise.resolve(false)
          } else if (this.form.idCard === "") {
            utils.popoverErrTip("#idCard", "必须填写身份证号码！")
            return Promise.resolve(false)
          } else if (!utils.IdCardRegexp.test(this.form.idCard)) {
            utils.popoverErrTip("#idCard", "必须填写正确的身份证号码！")
            return Promise.resolve(false)
          } else if (this.form.lvAddress === "" && this.form.cmpId === "") {
            utils.popoverErrTip("#cmpId_lvAddr", "必须选择现在居住地址或者工作单位！")
            return Promise.resolve(false)
          } else if (!await this.$refs["agent-form"].onNextBtnClick()) {
            utils.popoverErrTip("#name", "该单位/房屋不存在该人员信息！")
            return Promise.resolve(false)
          }
          break
        case "person":
          if (this.form.name === "") {
            utils.popoverErrTip("#name", "必须选择将要离开的人员！")
            return Promise.resolve(false)
          }
          break
        case "whereto":
          if (this.form.toAddress === "") {
            utils.popoverErrTip("#toAddress", "必须填写将要去往的地址！")
            return Promise.resolve(false)
          }
          break
        case "connect":
          if (this.form.phone === "") {
            utils.popoverErrTip("#phone", "必须填写联系电话！")
            return Promise.resolve(false)
          } else if (!utils.PhoneRegexp.test(this.form.phone)) {
            utils.popoverErrTip("#phone", "必须填写正确联系电话！")
            return false
          }
          break
      }
      return Promise.resolve(true)
    },
    async onStepBtnClick(idx) {
      const stepOrderKeys = Object.keys(this.stepOrder)
      const nxtIdx = stepOrderKeys.indexOf(this.curStep) + idx
      if (nxtIdx === -1 || nxtIdx === this.stepOrder.length) {
        return
      }
      if (idx === 1) {
        if (!await this._validFormData()) {
          return
        }
        this.stepOrder[this.curStep] = true
      }
      this.curStep = stepOrderKeys[nxtIdx]
    },
    onFinishBtnClick() {
      this.formSubmit = true
      MessageBox({
        title: "提示",
        message: "确认该人员已离开?",
        showCancelButton: true
      }).then(async action => {
        if (action !== "confirm") {
          this.formSubmit = false
          return
        }
        this.form.cmpId = parseInt(this.form.cmpId)
        const url = "/population-statistics/mdl/v1/record"
        await utils.reqBackend(axios.post(url, this.form), data => {
          Toast({
            message: "去销成功！请等待协管核实",
            iconClass: "iconfont icon-select-bold"
          })
          this.$router.push({path: "/"})
        })
      })
    }
  }
}
</script>
