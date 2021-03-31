<template>
  <div style="overflow: hidden">
    <ul class="nav nav-pills nav-fill nav-header">
      <li class="nav-item">
        <a class="nav-link" :class="{'active': curStep === 'person', 'disabled': !stepOrder['person']}" v-on:click="curStep = 'person'">人员</a>
      </li>
      <i class="iconfont icon-arrow-right icon-align-middle"/>
      <li class="nav-item">
        <a class="nav-link" :class="{'active': curStep === 'whereto', 'disabled': !stepOrder['whereto']}" v-on:click="curStep = 'whereto'">去向</a>
      </li>
      <i class="iconfont icon-arrow-right icon-align-middle"/>
      <li class="nav-item">
        <a class="nav-link" :class="{'active': curStep === 'connect', 'disabled': !stepOrder['connect']}" v-on:click="curStep = 'connect'">联系方式</a>
      </li>
    </ul>
    <div style="position: absolute; top: 60px; left: 0; right: 0">
      <lv-psn-form v-if="curStep === 'person'" :form="form"/>
      <where-to-form v-if="curStep === 'whereto'" :form="form"/>
      <connect-form v-if="curStep === 'connect'" :form="form"/>
    </div>
    <div class="fixed-bottom" style="padding: 10px 5px">
      <mt-button v-if="curStep !== 'person'" type="default" @click="onStepBtnClick(-1)">上一步</mt-button>
      <mt-button v-if="curStep !== 'connect'" class="float-right" type="primary" @click="onStepBtnClick(1)">下一步</mt-button>
      <mt-button v-else class="float-right" type="primary" @click="onFinishBtnClick">完成</mt-button>
    </div>
  </div>
</template>

<script>
import lvPsnForm from "../comps/lvPsnForm"
import whereToForm from "../comps/whereToForm"
import connectForm from "../comps/connectForm"
import { MessageBox, Toast } from "mint-ui"

export default {
  components: {
    "lv-psn-form": lvPsnForm,
    "where-to-form": whereToForm,
    "connect-form": connectForm
  },
  data() {
    return {
      curStep: "person",
      stepOrder: {
        "person": false,
        "whereto": false,
        "connect": false
      },
      form: {
        type: "leave",
        purpose: "",
        psnId: -1,
        name: "",
        idCard: "",
        phone: "",
        hhAddress: "",
        lvAddress: "",
        toAddress: "",
        cmpId: -1,
        passed: false
      }
    }
  },
  methods: {
    onStepBtnClick(idx) {
      const stepOrderKeys = Object.keys(this.stepOrder)
      const nxtIdx = stepOrderKeys.indexOf(this.curStep) + idx
      if (nxtIdx === -1 || nxtIdx === this.stepOrder.length) {
        return
      }
      if (idx === 1) {
        this.stepOrder[this.curStep] = true
      }
      this.curStep = stepOrderKeys[nxtIdx]
    },
    onFinishBtnClick() {
      MessageBox({
        title: "提示",
        message: "确认该人员已离开?",
        showCancelButton: true
      }).then(async action => {
        if (action !== "confirm") {
          return
        }
        this.form.cmpId = parseInt(this.form.cmpId)
        const res = await this.axios.post("/population-statistics/mdl/v1/record", this.form)
        if (res.status !== 200) {
          Toast({
            message: `系统错误！${res.statusText}`,
            iconClass: "iconfont icon-close-bold"
          })
        } else {
          Toast({
            message: "去销成功！请等待协管核实",
            iconClass: "iconfont icon-select-bold"
          })
          this.$router.go(-1)
        }
      })
    }
  }
}
</script>
