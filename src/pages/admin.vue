<template>
  <div>
    <div v-if="logined" style="position: fixed; top: 0; bottom: 55px; left: 0; right: 0; overflow-y: scroll">
      <!-- 审批列表 -->
      <mt-cell v-for="record in waitForPass"
        :title="record.name"
        :key="record.id"
        is-link
        @click="onShwPsnDetailClick(record)">
          
        <mt-button size="small" type="primary" @click="onPassPsnClick(record)">通过</mt-button>
      </mt-cell>
    </div>
    <div v-else>
      <mt-field label="用户名" placeholder="请输入用户名" v-model="form.username"/>
      <mt-field label="密码" placeholder="请输入密码" type="password" v-model="form.password"/>
      <div class="w-100 fixed-bottom mb-55" style="background-color: white">
        <mt-button class="mlr-1pc mtb-1pc" style="width: 98vw" type="primary" @click="onLgnBtnClick">登录</mt-button>
        <mt-button class="mlr-1pc mtb-1pc" style="width: 98vw; background-color: #04BE02; color: white" disabled>
          <img src="/assets/imgs/wechat.png" height="20" width="20" style="color: white" slot="icon">微信登录
        </mt-button>
      </div>
    </div>
    <btm-navi-bar select="admin"/>
  </div>
</template>

<script>
import btmNaviBar from "../comps/btmNaviBar"
import { MessageBox, Toast } from "mint-ui"

export default {
  components: {
    "btm-navi-bar": btmNaviBar
  },
  data() {
    return {
      logined: false,
      form: {
        username: "",
        password: ""
      },
      waitForPass: []
    }
  },
  methods: {
    async onLgnBtnClick() {
      this.logined = true

      const res = await this.axios.get("/population-statistics/mdl/v1/records?passed=0")
      if (res.status != 200) {
        Toast({
          message: `系统错误！${res.statusText}`,
          iconClass: "iconfont icon-close-bold"
        })
      } else {
        this.waitForPass = res.data.data
      }
    },
    onShwPsnDetailClick(record) {

    },
    onPassPsnClick(record) {
      console.log(record)
      MessageBox({
        title: "提示",
        message: "确认通过该审批?",
        showCancelButton: true
      }).then(async action => {
        if (action !== "confirm") {
          return
        }
        const ress = await Promise.all([
          this.axios.put(`/population-statistics/mdl/v1/record/${record.id}`, {passed: true}),
          this.axios.post("/population-statistics/mdl/v1/person", record)
        ])
        for (let res of ress) {
          if (res.status != 200) {
            Toast({
              message: `系统错误！${res.statusText}`,
              iconClass: "iconfont icon-close-bold"
            })
          }
          return
        }
        Toast({
          message: "审批通过！人员已录入实有人口",
          iconClass: "iconfont icon-select-bold"
        })
        this.$router.go(-1)
      })
    }
  }
}
</script>