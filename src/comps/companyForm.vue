<template>
  <div>
    <mt-field label="单位注册名称" placeholder="请输入营业执照上的全称" v-model="form.name"/>
    <mt-field label="店名称" placeholder="请输入招牌名称" v-model="form.shopName"/>
    <mt-field label="注册编号" placeholder="请输入注册编号" v-model="form.regId"/>
    <mt-field label="地址" placeholder="请输入所在地址" v-model="form.address"/>
    <mt-field label="法人姓名" placeholder="请输入法人姓名" v-model="form.lglName"/>
    <mt-field label="法人身份证" placeholder="请输入法人身份证" v-model="form.lglId"/>
    <mt-field label="法人手机号" placeholder="请输入法人手机号" type="tel" v-model="form.lglPhone"/>
    <div class="w-100 fixed-bottom mb-55" style="background-color: white">
      <mt-button class="mlr-1pc mtb-1pc" style="width: 98vw" type="primary" @click.prevent="onSubmitClick">提交</mt-button>
    </div>
  </div>
</template>

<script>
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
      }
    }
  },
  methods: {
    async onSubmitClick() {
      const res = await this.axios.post("/population-statistics/mdl/v1/company", this.form)
      if (res.status != 200) {
        Toast({
          message: `系统错误！${res.statusText}`,
          iconClass: "iconfont icon-close-bold"
        })
      } else {
        Toast({
          message: "提交成功！",
          iconClass: "iconfont icon-select-bold"
        })
        this.$router.push({path: "/population-statistics/list?type=company"})
      }
    }
  }
}
</script>

<style type="text/scss">

</style>