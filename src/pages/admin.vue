<template>
  <div>
    <div v-if="logined" class="approval-panel">
      <!-- 审批列表 -->
      <div v-if="!selRecord">
        <mt-cell v-for="record in waitForPass"
        :title="`${record.name} | ${record.lvAddress}`"
        :key="record.id"
        is-link @click.native="selRecord = record">
          <mt-badge slot="icon" :type="record.isLeave ? 'error' : 'success'">{{record.typeCn}}</mt-badge>
          <mt-button size="small" type="primary" @click="onPassPsnClick(record)">通过</mt-button>
        </mt-cell>
      </div>
      <div v-else>
        <mt-header fixed title="人员信息">
          <mt-button slot="left" icon="back" @click="selRecord = null">返回</mt-button>
        </mt-header>
        <div class="record-detail">
          <mt-cell title="类型" :value="selRecord.typeCn"/>
          <mt-cell v-if="!selRecord.isLeave" title="来此目的" :value="selRecord.purpose === 'work' ? '工作' : '居住'"/>
          <mt-cell title="姓名" :value="selRecord.name"/>
          <mt-cell title="身份证" :value="selRecord.idCard"/>
          <mt-cell title="手机号" :value="selRecord.phone"/>
          <mt-cell title="居住地" :value="selRecord.lvAddress"/>
          <mt-cell v-if="selRecord.isLeave" title="目的地" :value="selRecord.toAddress"/>
          <mt-cell v-if="selRecord.cmpId" title="单位" :value="selRecord.company"/>
          <mt-cell title="申请时间" :value="selRecord.createdAt"/>
        </div>
        <div class="pass-btn-area">
          <mt-button class="w-100" type="primary" @click="onPassPsnClick(selRecord)">通过</mt-button>
        </div>
      </div>
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
      selRecord: null,
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
        this.waitForPass = res.data.data.map(record => {
          record.isLeave = record.type === "leave"
          record.typeCn = record.isLeave ? "离去" : "到来"
          return record
        })
      }
    },
    onPassPsnClick(record) {
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
          (record.type === "leave" ?
            this.axios.delete(`/population-statistics/mdl/v1/person/${record.psnId}`) :
            this.axios.post("/population-statistics/mdl/v1/person", record))
        ])
        for (let res of ress) {
          if (res.status !== 200) {
            Toast({
              message: `系统错误！${res.statusText}`,
              iconClass: "iconfont icon-close-bold"
            })
            return
          }
        }
        Toast({
          message: "审批通过！人员已更新到实有人口",
          iconClass: "iconfont icon-select-bold"
        })
        this.$router.push({path: "/population-statistics/list?type=person"})
      })
    }
  }
}
</script>

<style lang="scss">
.approval-panel {
  position: fixed;
  top: 0;
  bottom: 55px;
  left: 0;
  right: 0;
  overflow-y: scroll
}

.pass-btn-area {
  padding: 5px 3px;
  position: fixed;
  bottom: 55px;
  left: 0;
  right: 0
}

.record-detail {
  position: absolute;
  top: 40px;
  bottom: 51px;
  left: 0;
  right: 0;
  overflow-y: scroll
}
</style>
