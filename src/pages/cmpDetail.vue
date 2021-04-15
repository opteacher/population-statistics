<template>
  <div>
    <mt-header v-if="!uneditable" title="公司详情">
      <router-link :to="`/population-statistics/list?type=${company.shopName ? 'company' : 'house'}`" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
    </mt-header>
    <div class="company-detail-panel" :style="uneditable ? 'top: 0; bottom: 50px' : 'top: 40px; bottom: 101px'">
      <div>
        <mt-cell v-if="company.name" title="单位注册名称" :value="company.name"/>
        <mt-cell v-if="company.shopName" title="店名称" :value="company.shopName"/>
        <mt-cell v-if="company.regId" title="注册编号" :value="company.regId"/>
        <mt-cell title="地址" :value="company.address"/>
        <mt-cell v-if="company.lglName" title="法人姓名" :value="company.lglName"/>
        <mt-cell v-if="company.lglId" title="法人身份证" :value="company.lglId"/>
        <mt-cell v-if="company.lglPhone" title="法人手机号" :value="company.lglPhone"/>
        <mt-cell :title="company.shopName ? '员工' : '居民'" :value="!showPeople ? '展开' : '收起'" is-link @click.native="showPeople = !showPeople"
          data-target="#peopleList" data-toggle="collapse" aria-expanded="false" aria-controls="peopleList"/>
      </div>
      <div class="collapse mt-3" id="peopleList">
        <mt-cell v-for="psn in company.people" :key="psn.id" :title="psn.name" value="详情" is-link @click.native="onPersonClick(psn)"/>
      </div>
    </div>
    <div v-if="uneditable" class="w-100 fixed-bottom mtb-1pc mlr-1pc" style="background-color: white">
      <mt-button class="w-98" type="primary" data-toggle="modal" @click="report.showTopPopup = true">信息有误？提醒管理员</mt-button>
    </div>
    <div v-else class="w-100 fixed-bottom mb-55" style="background-color: white">
      <mt-button class="bottom-half-btn" type="primary" @click="onUpdateClick">编辑</mt-button>
      <mt-button class="bottom-half-btn" type="danger" @click="onDeleteClick">删除</mt-button>
    </div>
    <btm-navi-bar v-if="!uneditable" select="company"/>
    <mt-popup class="w-100" v-model="report.showTopPopup" position="top">
      <mt-picker :slots="report.slots" :visible-item-count="3" :show-toolbar="false" @change="onReportChanged"/>
      <mt-field label="补充说明" placeholder="请输入补充说明（可选）" v-model="report.form.desc"/>
      <mt-button class="w-100 br-0" type="primary" @click="onReportSubmit">确认</mt-button>
    </mt-popup>
  </div>
</template>

<script>
import btmNaviBar from "../comps/btmNaviBar"
import { MessageBox, Toast } from "mint-ui"
import { reqBackend } from "../utils"
import "url"
import cookies from "../cookies"

export default {
  components: {
    "btm-navi-bar": btmNaviBar
  },
  data() {
    return {
      company: {
        people: []
      },
      showPeople: false,
      uneditable: false,
      URLSearchParams,
      report: {
        showTopPopup: false,
        slots: [{
          flex: 1,
          values: [],
          textAlign: "right"
        }, {
          divider: true,
          content: "-"
        }, {
          flex: 1,
          values: ["变更", "错误", "缺失"],
          textAlign: "left"
        }],
        form: {
          type: "",
          relId: -1,
          name: "",
          props: "",
          desc: "",
          submit: "",
          sbtPhone: "",
        }
      }
    }
  },
  async created() {
    this.uneditable = Boolean(cookies.get("uneditable"))
    let url = ""
    if (this.$route.query.shopName) {
      url = `/population-statistics/mdl/v1/persons?cmpId=${this.$route.query.id}`
      this.report.slots[0].values = ["单位注册名称", "店名称", "注册编号", "地址", "法人", "法人手机号"]
    } else {
      url = `/population-statistics/mdl/v1/persons?lvAddress=${this.$route.query.address}`
      this.report.slots[0].values = ["地址"]
    }
    this.company = Object.assign(this.$route.query, {
      people: await reqBackend(axios.get(url))
    })
  },
  beforeRouteLeave(to, from, next) {
    if (to.path !== "/population-statistics/person-detail") {
      cookies.clear("uneditable")
    }
    next()
  },
  methods: {
    onUpdateClick() {
      this.$router.push({path: `/population-statistics/input?type=company&${(new URLSearchParams(this.company)).toString()}`})
    },
    onDeleteClick() {
      MessageBox({
        title: "提示",
        message: "确定执行此操作?",
        showCancelButton: true
      }).then(async action => {
        if (action !== "confirm") {
          return
        }
        const url = `/population-statistics/mdl/v1/company/${this.company.id}`
        const data = await reqBackend(axios.delete(url))
        if (data) {
          Toast({
            message: "删除成功！",
            iconClass: "iconfont icon-select-bold"
          })
          this.$router.go(-1)
        }
      })
    },
    onPersonClick(psn) {
      this.$router.push({path: `/population-statistics/person-detail?${(new URLSearchParams(psn)).toString()}`})
    },
    onReportSubmit() {
      this.report.showTopPopup = false
      MessageBox({
        title: "提示",
        message: "确定上报信息更新？管理员收到此记录会对您的居住房屋或工作单位进行核实",
        showCancelButton: true
      }).then(async action => {
        if (action !== "confirm") {
          return
        }
        this.report.form.type = this.company.shopName ? "单位" : "房屋"
        this.report.form.relId = parseInt(this.company.id)
        this.report.form.name = this.company.shopName || this.company.address
        this.report.form.submit = this.$route.query.submit
        this.report.form.sbtPhone = this.$route.query.sbtPhone
        if (await reqBackend(axios.post("/population-statistics/mdl/v1/report", this.report.form))) {
          Toast({
            message: "提交成功！感谢您提交的信息更新，稍后管理员会对您提交的信息进行确认",
            iconClass: "iconfont icon-select-bold"
          })
        }
      })
    },
    onReportChanged() {
      this.report.form.props = `${arguments[1][0]}.${arguments[1][1]}`
    }
  }
}
</script>

<style lang="scss">
.company-detail-panel {
  position: fixed;
  left: 0;
  right: 0;
  overflow-y: scroll;
}
</style>
