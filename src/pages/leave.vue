<template>
  <div style="overflow: hidden">
    <ul class="nav nav-pills nav-fill" style="padding: 10px 5px">
      <li class="nav-item">
        <a class="nav-link" :class="{'active': curStep === 'person', 'disabled': !stepOrder['person']}" v-on:click="curStep = 'person'">人员</a>
      </li>
      <i class="iconfont icon-arrow-right"/>
      <li class="nav-item">
        <a class="nav-link" :class="{'active': curStep === 'whereto', 'disabled': !stepOrder['whereto']}" v-on:click="curStep = 'whereto'">去向</a>
      </li>
      <i class="iconfont icon-arrow-right"/>
      <li class="nav-item">
        <a class="nav-link" :class="{'active': curStep === 'connect', 'disabled': !stepOrder['connect']}" v-on:click="curStep = 'connect'">联系方式</a>
      </li>
    </ul>
    <div>
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

export default {
  components: {
    "lv-psn-form": lvPsnForm,
    "where-to-form": whereToForm,
    "connect-form": connectForm
  },
  data() {
    return {
      stepOrder: {
        "person": false,
        "whereto": false,
        "connect": false
      },
      curStep: "person",
      form: {
        idCard: "",
        name: "",
        lvAddress: "",
        toAddress: "",
        phone: ""
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
        // @TODO
        this.$router.go(-1)
      })
    }
  }
}
</script>

