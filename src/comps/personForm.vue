<template>
  <div>
    <div>
      <mt-field label="姓名" placeholder="请输入真实姓名" v-model="form.name"/>
      <mt-field label="身份证" placeholder="请输入身份证号码" v-model="form.idCard"/>
      <mt-field label="手机号" placeholder="请输入手机号" type="tel" v-model="form.phone"/>
      <mt-field label="户籍地址" placeholder="请输入户籍地址" v-model="form.hhAddress"/>
      <mt-field label="居住地址" placeholder="请输入居住地址" v-model="form.lvAddress"/>
      <mt-cell class="mint-field" title="所在单位"
        is-link :to="`/population-statistics/list?type=company&mode=select&search=${form.company}`">
        <span style="color: gray">{{form.company || "请选择所在单位"}}</span>
      </mt-cell>
    </div>
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
        cmpId: -1,
        company: ""
      },
      URLSearchParams
    }
  },
  created() {
    if (this.$route.query.id) {
      this.form.id = parseInt(this.$route.query.id)
      this.form.name = this.$route.query.name || ""
      this.form.idCard = this.$route.query.idCard || ""
      this.form.phone = this.$route.query.phone || ""
      this.form.hhAddress = this.$route.query.hhAddress || ""
      this.form.lvAddress = this.$route.query.lvAddress || ""
      this.form.cmpId = parseInt(this.$route.query.cmpId) || -1
      this.form.company = this.$route.query.company || ""
    }
  },
  methods: {
    async onSubmitClick() {
      const res = (this.form.id ?
        await this.axios.put(`/population-statistics/mdl/v1/person/${this.form.id}`, this.form) :
        await this.axios.post("/population-statistics/mdl/v1/person", this.form))
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