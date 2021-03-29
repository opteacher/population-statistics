<template>
  <div>
    <mt-field label="用户名" placeholder="请输入用户名" v-model="form.username"/>
    <mt-field label="密码" placeholder="请输入密码" type="password" v-model="form.password"/>
    <div class="w-100 fixed-bottom mb-55" style="background-color: white">
      <mt-button class="mlr-1pc mtb-1pc" style="width: 98vw" type="primary" @click="onLgnBtnClick">登录</mt-button>
      <mt-button class="mlr-1pc mtb-1pc" style="width: 98vw; background-color: #04BE02; color: white" @click="onLgnBtnClick">
        <img src="/assets/imgs/wechat.png" height="20" width="20" style="color: white" slot="icon">微信登录
      </mt-button>
    </div>
    <btm-navi-bar select="admin"/>
  </div>
</template>

<script>
import btmNaviBar from "../comps/btmNaviBar"

export default {
  components: {
    "btm-navi-bar": btmNaviBar
  },
  data() {
    return {
      form: {
        username: "",
        password: ""
      }
    }
  },
  methods: {
    onLgnBtnClick() {

    }
  }
}
</script>