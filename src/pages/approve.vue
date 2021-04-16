<template>
  <div class="h-100">
    <div v-if="!selRecord" class="h-100">
      <mt-navbar v-model="selTab">
        <mt-tab-item id="1">来等去销</mt-tab-item>
        <mt-tab-item id="2">上报消息</mt-tab-item>
      </mt-navbar>
      <mt-tab-container class="tab-container-h100" v-model="selTab">
        <mt-tab-container-item id="1">
          <div v-if="hasPassToApv">
            <record-cell v-for="record in waitForPass" :key="record.id" :record="record"
              :onPassPsnClick="onPassPsnClick" :onRecordClick="onRecordClick"/>
          </div>
          <div v-else class="center-container">
            <p style="color: rgba(0, 0, 0, .4); font-size: 15pt">没有人员的来去申请上报</p>
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="2">
          <div v-if="hasErrUpdToApv">
            <report-cell v-for="report in waitForSolve" :key="report.id" :report="report"/>
          </div>
          <div v-else class="center-container">
            <p style="color: rgba(0, 0, 0, .4); font-size: 15pt">没有上报的错误或更新信息</p>
          </div>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
    <div v-else>
      <mt-header fixed title="人员信息">
        <mt-button slot="left" icon="back" @click="selRecord = null">返回</mt-button>
      </mt-header>
      <record-form :record="selRecord" :top="40" :bottom="106"/>
      <div class="pass-btn-area">
        <mt-button class="bottom-half-btn" type="primary" @click.prevent="onPassPsnClick(selRecord)">通过</mt-button>
        <mt-button class="bottom-half-btn" type="danger" @click="onRejectPsnClick">拒绝</mt-button>
      </div>
    </div>
    <btm-navi-bar select="approve"/>
  </div>
</template>

<script>
import _ from "lodash"
import utils from "../utils"
import recordCell from "../comps/recordCell"
import recordForm from "../comps/recordForm"
import reportCell from "../comps/reportCell"
import btmNaviBar from "../comps/btmNaviBar"
import { MessageBox, Toast } from "mint-ui"
export default {
  components: {
    "btm-navi-bar": btmNaviBar,
    "record-cell": recordCell,
    "record-form": recordForm,
    "report-cell": reportCell
  },
  data() {
    return {
      selRecord: null,
      selTab: "1",
      waitForPass: [],
      hasPassToApv: false,
      waitForSolve: [],
      hasErrUpdToApv: false
    }
  },
  created() {
    this._refreshRecords()
  },
  methods: {
    async _refreshRecords() {
      let url = "/population-statistics/mdl/v1/records?passed=0"
      this.waitForPass = await utils.reqBackend(axios.get(url))
      this.hasPassToApv = Boolean(this.waitForPass.length)

      url = "/population-statistics/mdl/v1/reports?solved=0"
      this.waitForSolve = await utils.reqBackend(axios.get(url))
      this.hasErrUpdToApv = Boolean(this.waitForSolve.length)
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
        let pmss = [
          axios.put(`/population-statistics/mdl/v1/record/${record.id}`, {passed: true})
        ]
        if (record.type === "leave") {
          pmss.push(axios.delete(`/population-statistics/mdl/v1/person/${record.psnId}`))
        } else {
          pmss.push(axios.post("/population-statistics/mdl/v1/person", _.pick(record, [
            "name", "idCard", "gender", "nation", "phone", "hhAddress", "lvAddress", "cmpId", "company"
          ])))
        }
        await utils.reqBackend(pmss)
        Toast({
          message: "审批通过！人员已更新到实有人口",
          iconClass: "iconfont icon-select-bold"
        })
        this.$router.push({path: "/population-statistics/list?type=person"})
      })
    },
    onRejectPsnClick() {
      MessageBox({
        title: "提示",
        message: "确认拒绝该审批?",
        showCancelButton: true
      }).then(async action => {
        if (action !== "confirm") {
          return
        }
        const url = `/population-statistics/mdl/v1/record/${this.selRecord.id}`
        await utils.reqBackend(axios.delete(url))
        Toast({
          message: "审批拒绝！",
          iconClass: "iconfont icon-select-bold"
        })
        this.selRecord = null
        this._refreshRecords()
      })
    },
    onRecordClick(record) {
      this.selRecord = record
    }
  }
}
</script>

<style lang="scss">
.pass-btn-area {
  position: fixed;
  bottom: 55px;
  left: 0;
  right: 0;
  background-color: white;
}

.tab-container-h100 {
  position: fixed;
  top: 49px;
  bottom: 55px;
  left: 0;
  right: 0;

  .mint-tab-container-wrap {
    height: 100%;

    .mint-tab-container-item {
      height: 100%;
    }
  }
}
</style>