<template>
  <div>
    <div>
      <mt-field label="用户名" placeholder="请输入用户名" v-model="form.username"/>
      <mt-field label="密码" placeholder="请输入密码" type="password" v-model="form.password"/>
      <mt-field label="注册码" placeholder="请输入注册码（注册时需要）" v-model="form.regCode"/>
    </div>
    <div class="w-100 fixed-bottom" style="background-color: white">
      <mt-button class="mlr-1pc mtb-1pc" style="width: 98vw" type="primary" @click="onLgnBtnClick">登录 / 注册</mt-button>
      <mt-button class="mlr-1pc mtb-1pc" style="width: 98vw; background-color: #04BE02; color: white" disabled>
        <img src="/assets/imgs/wechat.png" height="20" width="20" style="color: white" slot="icon">微信登录
      </mt-button>
    </div>
  </div>
</template>

<script>
import { reqBackend } from "../utils"
import { Toast, Indicator } from "mint-ui"
import crypto  from "crypto"
export default {
  data() {
    return {
      form: {
        username: "",
        password: "",
        regCode: ""
      }
    }
  },
  methods: {
    async _reqBackend(pms) {
      Indicator.open({text: "加载中..."})
      const res = await pms
      if (res.status === 400) {
        Toast({
          message: res.message,
          iconClass: "iconfont icon-close-bold"
        })
        return null
      } else if (res.status !== 200) {
        Toast({
          message: `系统错误！${res.statusText}`,
          iconClass: "iconfont icon-close-bold"
        })
        return null
      } else {
        return res.data
      }
    },
    async onLgnBtnClick() {
      if (this.form.regCode) {
        if (!await this._reqBackend(this.axios.post("/population-statistics/api/v1/admin/log/in", {
          username: "*ADMIN#", password: this.form.regCode
        }))) {
          return
        }
        if (!await this._reqBackend(this.axios.post("/population-statistics/api/v1/admin/log/up", this.form))) {
          return
        }
        Indicator.close()
        Toast({
          message: "注册成功！",
          iconClass: "iconfont icon-select-bold"
        })
      } else {

      }
    }
  }
}
</script>
