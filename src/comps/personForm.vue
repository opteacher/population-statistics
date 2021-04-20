<template>
  <div class="scroll-panel" style="top: 49px; bottom: 55px">
    <div>
      <id-card-field :form="form"/>
      <mt-field label="姓名" placeholder="请输入真实姓名" v-model="form.name"/>
      <gender-field :form="form"/>
      <nation-field :form="form" :bottom="55"/>
      <mt-field label="手机号" placeholder="请输入手机号" type="tel" v-model="form.phone"/>
      <mt-field label="户籍地址" placeholder="请输入户籍地址" v-model="form.hhAddress"/>
      <mt-field label="居住地址" placeholder="请输入居住地址" v-model="form.lvAddress"/>
      <mt-cell class="mint-field" title="所在单位"
        is-link :to="`/population-statistics/list?type=company&mode=select&${(new URLSearchParams(form)).toString()}`">
        <span style="color: gray">{{form.company || "请选择所在单位"}}</span>
      </mt-cell>
      <mt-cell title="特殊" :value="!showSpecial ? '展开' : '收起'" is-link @click.native="showSpecial = !showSpecial"
        data-target="#specialList" data-toggle="collapse" aria-expanded="false" aria-controls="specialList"/>
    </div>
    <div class="collapse mt-3" id="specialList">
      <mt-cell title="独居老人" class="mint-field">
        <mt-switch v-model="form.isLvAlnOld" style="color: grey">{{form.isLvAlnOld ? "是" : "否"}}</mt-switch>
      </mt-cell>
      <mt-cell title="孕妇" class="mint-field">
        <mt-switch v-model="form.isPregWman" style="color: grey">{{form.isPregWman ? "是" : "否"}}</mt-switch>
      </mt-cell>
      <mt-cell title="心理精神疾病患者" class="mint-field">
        <mt-switch v-model="form.hasMentalIllness" style="color: grey">{{form.hasMentalIllness ? "有" : "无"}}</mt-switch>
      </mt-cell>
      <mt-cell title="残疾" class="mint-field">
        <mt-switch v-model="form.isDisability" style="color: grey">{{form.isDisability ? "是" : "否"}}</mt-switch>
      </mt-cell>
      <mt-cell title="可疑" class="mint-field">
        <mt-switch v-model="form.isSuspicious" style="color: grey">{{form.isSuspicious ? "是" : "否"}}</mt-switch>
      </mt-cell>
      <mt-field label="可疑行为描述" placeholder="请输入描述" v-model="form.suspiciousRmks"/>
    </div>
    <div class="w-100">
      <mt-button class="mlr-1pc mtb-1pc" :disabled="formSubmit" type="primary" style="width: 98vw" @click.prevent="onSubmitClick">提交</mt-button>
    </div>
  </div>
</template>

<script>
import idCardField from "./idCardField"
import nationField from "./nationField"
import genderField from "./genderField"
import utils from "../utils"
import { Toast } from "mint-ui"
import "url"

export default {
  components: {
    "id-card-field": idCardField,
    "nation-field": nationField,
    "gender-field": genderField
  },
  data() {
    return {
      form: {
        name: "",
        idCard: "",
        gender: "男",
        nation: "汉族",
        phone: "",
        hhAddress: "",
        lvAddress: "",
        cmpId: -1,
        company: "",
        isLvAlnOld: false,
        isPregWman: false,
        hasMentalIllness: false,
        isDisability: false,
        isSuspicious: false,
        suspiciousRmks: "",
      },
      URLSearchParams,
      formSubmit: false,
      showSpecial: false,
    }
  },
  created() {
    if (this.$route.query.id) {
      this.form = utils.copyPerson(this.$route.query)
    }
  },
  methods: {
    async onSubmitClick() {
      this.formSubmit = true
      await utils.reqBackend(this.form.id ?
        axios.put(`/population-statistics/mdl/v1/person/${this.form.id}`, this.form) :
        axios.post("/population-statistics/mdl/v1/person", this.form))
      Toast({
        message: "提交成功！",
        iconClass: "iconfont icon-select-bold"
      })
      this.$router.push({path: "/population-statistics/list?type=person"})
    }
  }
}
</script>
