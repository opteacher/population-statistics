<template>
  <div class="h-100">
    <div v-if="!selRecord && !selReport" class="h-100">
      <mt-navbar v-model="selTab">
        <mt-tab-item id="1">来登去销</mt-tab-item>
        <mt-tab-item id="2">上报消息</mt-tab-item>
      </mt-navbar>
      <mt-tab-container class="tab-container-h100" v-model="selTab">
        <mt-tab-container-item id="1">
          <div v-if="hasPassToApv">
            <record-cell
              v-for="record in waitForPass"
              :key="record.id"
              :record="record"
              :onPassPsnClick="onPassPsnClick"
              :onRecordClick="onRecordClick"
            />
          </div>
          <div v-else class="center-container">
            <p style="color: rgba(0, 0, 0, 0.4); font-size: 15pt">
              没有人员的来去申请上报
            </p>
          </div>
        </mt-tab-container-item>
        <mt-tab-container-item id="2">
          <div v-if="hasErrUpdToApv">
            <report-cell
              v-for="report in waitForSolve"
              :key="report.id"
              :report="report"
              :onReportClick="onReportClick"
            />
          </div>
          <div v-else class="center-container">
            <p style="color: rgba(0, 0, 0, 0.4); font-size: 15pt">
              没有上报的错误或更新信息
            </p>
          </div>
        </mt-tab-container-item>
      </mt-tab-container>
    </div>
    <div v-else-if="selRecord">
      <mt-header fixed title="人员信息">
        <mt-button slot="left" icon="back" @click="selRecord = null"
          >返回</mt-button
        >
      </mt-header>
      <record-form :record="selRecord" :top="40" :bottom="106" />
      <div class="btm-btn-area">
        <mt-button
          class="bottom-half-btn"
          type="primary"
          @click.prevent="onPassPsnClick(selRecord)"
          >通过</mt-button
        >
        <mt-button
          class="bottom-half-btn"
          type="danger"
          @click="onRejectPsnClick"
          >拒绝</mt-button
        >
      </div>
    </div>
    <div v-else-if="selReport">
      <mt-header fixed title="上报信息">
        <mt-button slot="left" icon="back" @click="selReport = null"
          >返回</mt-button
        >
      </mt-header>
      <report-form :report="selReport" :top="40" :bottom="106" />
      <div class="btm-btn-area">
        <mt-button class="w-98 mtb-5 mlr-1pc" type="primary"
          >修正完毕</mt-button
        >
      </div>
    </div>
    <btm-navi-bar select="approve" />
  </div>
</template>

<script>
import * as utils from '../utils.js'
import recordCell from '../components/recordCell.vue'
import recordForm from '../components/recordForm.vue'
import reportCell from '../components/reportCell.vue'
import reportForm from '../components/reportForm.vue'
import btmNaviBar from '../components/btmNaviBar.vue'
import { MessageBox, Toast } from 'mint-ui'
export default {
  components: {
    'btm-navi-bar': btmNaviBar,
    'record-cell': recordCell,
    'record-form': recordForm,
    'report-cell': reportCell,
    'report-form': reportForm,
  },
  data() {
    return {
      selTab: '1',
      selRecord: null,
      waitForPass: [],
      hasPassToApv: false,
      selReport: null,
      waitForSolve: [],
      hasErrUpdToApv: false,
    }
  },
  created() {
    this._refreshRecords()
  },
  methods: {
    async _refreshRecords() {
      let url = '/population-statistics/mdl/v1/record/s?passed=0'
      this.waitForPass = await utils.reqBackend(axios.get(url))
      this.hasPassToApv = Boolean(this.waitForPass.length)

      url = '/population-statistics/mdl/v1/report/s?solved=0'
      this.waitForSolve = await utils.reqBackend(axios.get(url))
      this.hasErrUpdToApv = Boolean(this.waitForSolve.length)
    },
    onPassPsnClick(record) {
      MessageBox({
        title: '提示',
        message: '确认通过该审批?',
        showCancelButton: true,
      }).then(async (action) => {
        if (action !== 'confirm') {
          return
        }
        let pmss = [
          axios.put(`/population-statistics/mdl/v1/record/${record.id}`, {
            passed: true,
          }),
        ]
        if (record.type === 'leave') {
          pmss.push(
            axios.delete(`/population-statistics/mdl/v1/person/${record.psnId}`)
          )
        } else {
          pmss.push(
            axios.post(
              '/population-statistics/mdl/v1/person',
              _.pick(record, [
                'name',
                'idCard',
                'gender',
                'nation',
                'phone',
                'hhAddress',
                'lvAddress',
                'cmpId',
                'company',
              ])
            )
          )
        }
        await utils.reqBackend(pmss)
        Toast({
          message: '审批通过！人员已更新到实有人口',
          iconClass: 'iconfont icon-select-bold fs-50',
        })
        this.$router.push({
          path: '/population-statistics-frt/list?type=person',
        })
      })
    },
    onRejectPsnClick() {
      MessageBox({
        title: '提示',
        message: '确认拒绝该审批?',
        showCancelButton: true,
      }).then(async (action) => {
        if (action !== 'confirm') {
          return
        }
        const url = `/population-statistics/mdl/v1/record/${this.selRecord.id}`
        await utils.reqBackend(axios.delete(url))
        Toast({
          message: '审批拒绝！',
          iconClass: 'iconfont icon-select-bold fs-50',
        })
        this.selRecord = null
        this._refreshRecords()
      })
    },
    onRecordClick(record) {
      this.selRecord = record
    },
    onReportClick(report) {
      this.selReport = report
    },
  },
}
</script>

<style lang="less">
.btm-btn-area {
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
