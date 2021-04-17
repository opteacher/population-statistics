<template>
  <div class="ptb-10 plr-5 scroll-panel" style="top: 49px; bottom: 55px">
    <div class="card ptb-10 plr-5 mb-5">
      <h2 class="text-center mb-0"><b>实有单位：{{numOfCmps}}家</b></h2>
      <hr/>
      <ul class="w-100 mb-0 list-inline d-flex justify-content-around">
        <li class="list-inline-item">歇业：<br/>9999家</li>
        <li class="list-inline-item">月新增：<br/>{{numOfCmpsInM}}家</li>
        <li class="list-inline-item">年新增：<br/>{{numOfCmpsInY}}家</li>
      </ul>
    </div>
  </div>
</template>

<script>
import {reqBackend} from "../utils"
export default {
  data() {
    return {
      numOfCmps: 0,
      numOfCmpsInM: 0,
      numOfCmpsInY: 0
    }
  },
  created() {
    this.refresh()
  },
  methods: {
    async refresh() {
      const url = "/population-statistics/api/v1/bdata/companies/number-of-companies"
      const pmss = [
        axios.get(url),
        axios.get(url + "?scope=month"),
        axios.get(url + "?scope=year"),
      ]
      const data = await reqBackend(pmss)
      this.numOfCmps = data[0][0].cmpNum
      this.numOfCmpsInM = data[1][0].cmpNum
      this.numOfCmpsInY = data[2][0].cmpNum
    }
  }
}
</script>

