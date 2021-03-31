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
      <purpose-form v-if="curStep === 'purpose'" :form="form"/>
      <cm-psn-form v-if="curStep === 'person'" :form="form"/>
      <house-form v-if="curStep === 'house'" :form="form"/>
      <connect-form v-if="curStep === 'connect'" :form="form"/>
    </div>
    <div class="fixed-bottom" style="padding: 10px 5px">
      <mt-button v-if="curStep !== 'purpose'" type="default" @click="onStepBtnClick(-1)">上一步</mt-button>
      <mt-button v-if="curStep !== 'connect'" class="float-right" type="primary" @click="onStepBtnClick(1)">下一步</mt-button>
      <mt-button v-else class="float-right" type="primary" @click="onFinishBtnClick">完成</mt-button>
    </div>
  </div>
</template>

<script>
import purposeForm from "../comps/purposeForm"
import cmPsnForm from "../comps/cmPsnForm"
import houseForm from "../comps/houseForm"
import connectForm from "../comps/connectForm"
import { MessageBox, Toast } from "mint-ui"

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
        lvAddress: "",
        hhAddress: "",
        purpose: "",
        purposeCn: "",
        cmpId: "",
        company: "",
        phone: "",
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
        message: "确认该人员来访/居住/工作?",
        showCancelButton: true
      }).then(async action => {
        if (action !== "confirm") {
          return
        }
        if (typeof this.form.cmpId === "string" && this.form.cmpId !== "") {
          this.form.cmpId = parseInt(this.form.cmpId)
        }
        const res = await this.axios.post("/population-statistics/mdl/v1/record", this.form)
        if (res.status !== 200) {
          Toast({
            message: `系统错误！${res.statusText}`,
            iconClass: "iconfont icon-close-bold"
          })
        } else {
          Toast({
            message: "来登成功！请等待协管核实",
            iconClass: "iconfont icon-select-bold"
          })
          this.$router.go(-1)
        }
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