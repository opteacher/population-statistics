<template>
  <div>
    <mt-field label="姓名" placeholder="请输入真实姓名" v-model="form.name"/>
    <mt-field label="身份证" placeholder="请输入身份证号码" v-model="form.idCard"/>
    <mt-field label="手机号" placeholder="请输入手机号" type="tel" v-model="form.phone"/>
    <mt-field label="户籍地址" placeholder="请输入户籍地址" v-model="form.hhAddress"/>
    <mt-field label="居住地址" placeholder="请输入居住地址" v-model="form.lvAddress"/>
    <mt-cell class="mint-field" title="所在单位" is-link
    :to="`/population-statistics/list?type=company&mode=select&${(new URLSearchParams(form)).toString()}`">
      <span style="color: gray">{{form.workComp || "请选择所在单位"}}</span>
    </mt-cell>
    <div class="w-100 fixed-bottom mb-55" style="background-color: white">
      <mt-button class="mlr-1pc mtb-1pc" type="primary" style="width: 98vw" @click.prevent="onSubmitClick">提交</mt-button>
    </div>
  </div>
</template>

<script>
import { Toast } from "mint-ui"
import "url"

export default {
  data() {
    return {
      form: {
        name: "",
        idCard: "",
        phone: "",
        hhAddress: "",
        lvAddress: "",
        workComp: ""
      },
      URLSearchParams
    }
  },
  created() {
    if (this.$route.query) {
      this.form = this.$route.query
    }
  },
  methods: {
    async onSubmitClick() {
      const res = await this.axios.post("/population-statistics/mdl/v1/person", this.form)
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
        this.$router.push({path: "/population-statistics/list?type=person"})
      }
    }
  }
}
</script>

<style type="text/scss">
</style>