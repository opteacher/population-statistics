<template>
  <div>
    <div v-if="!selRecord">
      <record-cell v-for="record in waitForPass" :key="record.id" :record="record"
        :onPassPsnClick="onPassPsnClick" :onRecordClick="onRecordClick"/>
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
        <mt-cell v-if="!selRecord.cmpId" title="性别" :value="selRecord.gender"/>
        <mt-cell v-if="!selRecord.cmpId" title="民族" :value="selRecord.nation"/>
        <mt-cell title="手机号" :value="selRecord.phone"/>
        <mt-cell title="居住地" :value="selRecord.lvAddress"/>
        <mt-cell v-if="selRecord.isLeave" title="目的地" :value="selRecord.toAddress"/>
        <mt-cell v-if="selRecord.cmpId" title="单位" :value="selRecord.company"/>
        <mt-cell title="申请时间" :value="(new Date(selRecord.createdAt)).toLocaleString()"/>
      </div>
      <div class="pass-btn-area">
        <mt-button class="bottom-half-btn" type="primary" @click="onPassPsnClick">通过</mt-button>
        <mt-button class="bottom-half-btn" type="danger" @click="onRejectPsnClick">拒绝</mt-button>
      </div>
    </div>
    <btm-navi-bar select="approve"/>
  </div>
</template>

<script>
import utils from "../utils"
import recordCell from "../comps/recordCell"
import btmNaviBar from "../comps/btmNaviBar"
import { MessageBox, Toast } from "mint-ui"
export default {
  components: {
    "btm-navi-bar": btmNaviBar,
    "record-cell": recordCell
  },
  data() {
    return {
      selRecord: null,
      waitForPass: []
    }
  },
  created() {
    this._refreshRecords()
  },
  methods: {
    async _refreshRecords() {
      const url = "/population-statistics/mdl/v1/records?passed=0"
      await utils.reqBackend(this.axios.get(url), data => {
        this.waitForPass = data.map(record => {
          record.isLeave = record.type === "leave"
          record.typeCn = record.isLeave ? "离去" : "到来"
          return record
        })
      })
    },
    onPassPsnClick() {
      MessageBox({
        title: "提示",
        message: "确认通过该审批?",
        showCancelButton: true
      }).then(async action => {
        if (action !== "confirm") {
          return
        }
        let pmss = [
          this.axios.put(`/population-statistics/mdl/v1/record/${this.selRecord.id}`, {passed: true})
        ]
        if (this.selRecord.type === "leave") {
          pmss.push(this.axios.delete(`/population-statistics/mdl/v1/person/${this.selRecord.psnId}`))
        } else {
          pmss.push(this.axios.post("/population-statistics/mdl/v1/person", this.selRecord))
        }
        if (!await utils.reqBackend(pmss, data => {
          Toast({
            message: "审批通过！人员已更新到实有人口",
            iconClass: "iconfont icon-select-bold"
          })
          this.$router.push({path: "/population-statistics/list?type=person"})
        })) {
          return
        }
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
        await utils.reqBackend(this.axios.delete(url), data => {
          Toast({
            message: "审批拒绝！",
            iconClass: "iconfont icon-select-bold"
          })
          this.selRecord = null
          this._refreshRecords()
        })
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