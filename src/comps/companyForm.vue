<template>
  <div>
    <div>
      <mt-field label="单位注册名称" placeholder="请输入营业执照上的全称" v-model="form.name"/>
      <mt-field label="店名称" placeholder="请输入招牌名称" v-model="form.shopName"/>
      <mt-field label="注册编号" placeholder="请输入注册编号" v-model="form.regId"/>
      <mt-field label="地址" placeholder="请输入所在地址" v-model="form.address"/>
      <mt-field label="法人姓名" placeholder="请输入法人姓名" v-model="form.lglName"/>
      <mt-field label="法人身份证" placeholder="请输入法人身份证" v-model="form.lglId"/>
      <mt-field label="法人手机号" placeholder="请输入法人手机号" type="tel" v-model="form.lglPhone"/>
    </div>
    <div class="w-100 fixed-bottom mb-55" style="background-color: white">
      <mt-button class="mlr-1pc mtb-1pc" :disabled="formSubmit" style="width: 98vw" type="primary" @click.prevent="onSubmitClick">提交</mt-button>
    </div>
  </div>
</template>

<script>
import { reqBackend } from "../utils"
import { Toast } from "mint-ui"

export default {
  data() {
    return {
      form: {
        name: "",
        shopName: "",
        regId: "",
        address: "",
        lglName: "",
        lglId: "",
        lglPhone: ""
      },
      formSubmit: false
    }
  },
  created() {
    if (this.$route.query.id) {
      this.form.id = parseInt(this.$route.query.id)
      this.form.name = this.$route.query.name || ""
      this.form.shopName = this.$route.query.shopName || ""
      this.form.regId = this.$route.query.regId || ""
      this.form.address = this.$route.query.address || ""
      this.form.lglName = this.$route.query.lglName || ""
      this.form.lglId = this.$route.query.lglId || ""
      this.form.lglPhone = this.$route.query.lglPhone || ""
    }
  },
  methods: {
    async onSubmitClick() {
      this.formSubmit = true
      const pms = (this.form.id ?
        this.axios.put(`/population-statistics/mdl/v1/company/${this.form.id}`, this.form) :
        this.axios.post("/population-statistics/mdl/v1/company", this.form))
      const res = 
      await reqBackend(pms, data => {
        Toast({
          message: "提交成功！",
          iconClass: "iconfont icon-select-bold"
        })
        this.$router.push({path: `/population-statistics/list?type=${this.form.shopName ? 'company' : 'house'}`})
      })
    }
  }
}
</script>

<style type="text/scss">

</style>