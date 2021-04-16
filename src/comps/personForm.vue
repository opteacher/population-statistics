<template>
  <div class="scroll-panel" style="top: 49px; bottom: 55px">
    <div>
      <id-card-field :form="form"/>
      <mt-field label="姓名" placeholder="请输入真实姓名" v-model="form.name"/>
      <gender-field :form="form"/>
      <nation-field :form="form"/>
      <mt-field label="手机号" placeholder="请输入手机号" type="tel" v-model="form.phone"/>
      <mt-field label="户籍地址" placeholder="请输入户籍地址" v-model="form.hhAddress"/>
      <mt-field label="居住地址" placeholder="请输入居住地址" v-model="form.lvAddress"/>
      <mt-cell class="mint-field" title="所在单位"
        is-link :to="`/population-statistics/list?type=company&mode=select&${(new URLSearchParams(form)).toString()}`">
        <span style="color: gray">{{form.company || "请选择所在单位"}}</span>
      </mt-cell>
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
import { reqBackend } from "../utils"
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
        company: ""
      },
      URLSearchParams,
      formSubmit: false
    }
  },
  created() {
    if (this.$route.query.id) {
      this.form.id = parseInt(this.$route.query.id)
    }
    this.form.name = this.$route.query.name || ""
    this.form.idCard = this.$route.query.idCard || ""
    this.form.gender = this.$route.query.gender || ""
    this.form.nation = this.$route.query.nation || ""
    this.form.phone = this.$route.query.phone || ""
    this.form.hhAddress = this.$route.query.hhAddress || ""
    this.form.lvAddress = this.$route.query.lvAddress || ""
    this.form.cmpId = parseInt(this.$route.query.cmpId) || -1
    this.form.company = this.$route.query.company || ""
  },
  methods: {
    async onSubmitClick() {
      this.formSubmit = true
      await reqBackend(this.form.id ?
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
