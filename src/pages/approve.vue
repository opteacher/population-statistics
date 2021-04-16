<template>
  <div class="h-100">
    <div v-if="!selRecord" class="h-100">
      <div v-if="hasPassToApv">
        <record-cell v-for="record in waitForPass" :key="record.id" :record="record"
          :onPassPsnClick="onPassPsnClick" :onRecordClick="onRecordClick"/>
      </div>
      <div v-else class="center-container">
        <p style="color: rgba(0, 0, 0, .4); font-size: 15pt">现在暂时没有人员的来去申请上报</p>
      </div>
    </div>
    <div v-else>
      <mt-header fixed title="人员信息">
        <mt-button slot="left" icon="back" @click="selRecord = null">返回</mt-button>
      </mt-header>
      <div style="position: absolute; top: 40px; bottom: 106px; left: 0; right: 0">
        <record-form style="margin-bottom: 106px" :record="selRecord"/>
      </div>
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
import btmNaviBar from "../comps/btmNaviBar"
import { MessageBox, Toast } from "mint-ui"
export default {
  components: {
    "btm-navi-bar": btmNaviBar,
    "record-cell": recordCell,
    "record-form": recordForm
  },
  data() {
    return {
      selRecord: null,
      waitForPass: [],
      hasPassToApv: false
    }
  },
  created() {
    this._refreshRecords()
  },
  methods: {
    async _refreshRecords() {
      const url = "/population-statistics/mdl/v1/records?passed=0"
      this.waitForPass = await utils.reqBackend(axios.get(url))
      this.hasPassToApv = Boolean(this.waitForPass.length)
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
.approval-panel {
  position: fixed;
  top: 0;
  bottom: 55px;
  left: 0;
  right: 0;
  overflow-y: scroll
}

.pass-btn-area {
  position: fixed;
  bottom: 55px;
  left: 0;
  right: 0;
  background-color: white;
}
</style>