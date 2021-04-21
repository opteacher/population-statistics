<template>
  <div>
    <mt-header title="公司详情">
      <mt-button v-if="!uneditable" icon="back" slot="left" @click="onBackClick">返回</mt-button>
      <mt-button slot="right" @click="onPrintClick">导出Excel</mt-button>
    </mt-header>
    <div class="scroll-panel" :style="`top: 40px; bottom: ${uneditable ? '50' : '101'}px`">
      <div>
        <mt-cell v-if="company.name" title="单位注册名称" :value="company.name"/>
        <mt-cell v-if="company.shopName" title="店名称" :value="company.shopName"/>
        <mt-cell v-if="company.type" title="类型" :value="company.type"/>
        <mt-cell v-if="company.openHours" title="营业时间" :value="company.openHours"/>
        <mt-cell v-if="company.regId" title="注册编号" :value="company.regId"/>
        <mt-cell title="地址" :value="company.address"/>
        <mt-cell v-if="company.lglName" title="法人姓名" :value="company.lglName"/>
        <mt-cell v-if="company.lglId" title="法人身份证" :value="company.lglId"/>
        <mt-cell v-if="company.lglPhone" title="法人手机号" :value="company.lglPhone"/>
        <mt-cell v-if="company.hasLiving || company.isAlgStreet || company.hasStore || company.useFire || company.isTopBottom" title="消防标签">
          <mt-badge v-if="company.hasLiving" size="small" type="error">有住人</mt-badge>
          <mt-badge v-if="company.isAlgStreet" size="small" type="success">沿街</mt-badge>
          <mt-badge v-if="company.hasStore" size="small" type="warning">有仓库</mt-badge>
          <mt-badge v-if="company.useFire" size="small" type="error">用明火</mt-badge>
          <mt-badge v-if="company.isTopBottom" size="small" type="success">高层/地下室</mt-badge>
        </mt-cell>
        <mt-cell v-if="company.sellAlcohol || company.isSuspicious" title="治安标签">
          <mt-badge v-if="company.sellAlcohol" size="small" type="success">销售酒类</mt-badge>
          <mt-badge v-if="company.isSuspicious" size="small" type="error">存在可疑行径</mt-badge>
        </mt-cell>
        <mt-cell :title="company.shopName ? '员工' : '居民'" :value="!showPeople ? '展开' : '收起'" is-link @click.native="showPeople = !showPeople"
          data-target="#peopleList" data-toggle="collapse" aria-expanded="false" aria-controls="peopleList"/>
      </div>
      <div class="collapse mt-3" id="peopleList">
        <mt-cell v-for="psn in company.people" :key="psn.id" :title="psn.name" value="详情" is-link @click.native="onPersonClick(psn)"/>
      </div>
    </div>
    <div v-if="uneditable" class="w-100 fixed-bottom mtb-5 mlr-1pc white-bg-color">
      <mt-button class="w-98" type="primary" @click="report.showTopPopup = true">信息有误？提醒管理员</mt-button>
    </div>
    <div v-else class="w-100 fixed-bottom mb-55 white-bg-color">
      <mt-button class="bottom-half-btn" type="primary" @click="onUpdateClick">编辑</mt-button>
      <mt-button class="bottom-half-btn float-right" type="danger" @click="onDeleteClick">删除</mt-button>
    </div>
    <btm-navi-bar v-if="!uneditable" select="company"/>
    <mt-popup class="w-100" v-model="report.showTopPopup" position="top">
      <mt-picker :slots="report.slots" :visible-item-count="3" :show-toolbar="false" @change="onReportChanged"/>
      <div><mt-field label="补充说明" placeholder="请输入补充说明（可选）" v-model="report.form.desc"/></div>
      <mt-button class="w-100 br-0" type="primary" @click="onReportSubmit">确认</mt-button>
    </mt-popup>
  </div>
</template>

<script>
import btmNaviBar from "../comps/btmNaviBar"
import { MessageBox, Toast } from "mint-ui"
import utils from "../utils"
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
          solved: false
        }
      },
      printCmpDtl: true
    }
  },
  async created() {
    if (this.$route.query.uneditable) {
      this.uneditable = JSON.parse(this.$route.query.uneditable)
    }
    let url = ""
    if (this.$route.query.shopName) {
      url = `/population-statistics/mdl/v1/persons?cmpId=${this.$route.query.id}`
      this.report.slots[0].values = ["人员信息", "单位注册名称", "店名称", "注册编号", "地址", "法人", "法人手机号"]
    } else {
      url = `/population-statistics/mdl/v1/persons?lvAddress=${this.$route.query.address}`
      this.report.slots[0].values = ["人员信息", "地址"]
    }
    this.company = Object.assign(utils.copyCompany(this.$route.query), {
      people: await utils.reqBackend(axios.get(url))
    })

  },
  async mounted() {
    if (this.uneditable) {
      // 身份校验
      const url = "/population-statistics/api/v1/person/sign/stat"
      const data = await utils.reqBackend(axios.get(url, {
        headers: {"authorization": cookies.get("personTkn")}
      }), res => {
        if (!res.data.data) {
          Toast({
            message: res.data.message,
            iconClass: "iconfont icon-close-bold fs-50"
          })
          this.$router.push({path: "/population-statistics/valid"})
        }
      })
      if (!data) {
        return
      }
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.path !== "/population-statistics/person-detail") {
      cookies.clear("personTkn")
    }
    next()
  },
  methods: {
    onUpdateClick() {
      this.$router.push({path: `/population-statistics/input?tab=company&${(new URLSearchParams(this.company)).toString()}`})
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
        const data = await utils.reqBackend(axios.delete(url))
        if (data) {
          Toast({
            message: "删除成功！",
            iconClass: "iconfont icon-select-bold fs-50"
          })
          this.$router.go(-1)
        }
      })
    },
    onPersonClick(psn) {
      this.$router.push({path: `/population-statistics/person-detail?${this._cmbParams(psn)}&uneditable=${this.uneditable}`})
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
        if (await utils.reqBackend(axios.post("/population-statistics/mdl/v1/report", this.report.form))) {
          Toast({
            message: "提交成功！感谢您提交的信息更新，稍后管理员会对您提交的信息进行确认",
            iconClass: "iconfont icon-select-bold fs-50"
          })
        }
      })
    },
    onReportChanged() {
      this.report.form.props = `${arguments[1][0]}.${arguments[1][1]}`
    },
    _cmbParams(foothold) {
      return (new URLSearchParams(Object.assign(foothold, {
        submit: this.$route.query.submit,
        sbtPhone: this.$route.query.sbtPhone
      }))).toString()
    },
    async onPrintClick() {
      const url = `/population-statistics/api/v1/company/${this.company.id}/export/excel`
      const data = await utils.reqBackend(axios.get(url))
      Toast({
        message: "导出Excel成功！",
        iconClass: "iconfont icon-select-bold fs-50"
      })
      window.location.href = data
    },
    onBackClick() {
      if (this.$route.query.scroll) {
        utils.eventBus.$emit("scroll", this.$route.query.scroll)
      }
      this.$router.go(-1)
    }
  }
}
</script>
