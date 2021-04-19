<template>
  <div class="ptb-10 plr-5 scroll-panel" style="top: 49px; bottom: 55px">
    <div class="card ptb-10 plr-5 mb-5">
      <h2 class="text-center mb-0"><b>实有单位：{{totalNumber}}家</b></h2>
      <hr/>
      <ul class="w-100 mb-0 list-inline d-flex justify-content-around">
        <li class="list-inline-item">停业：<br/>{{numClosed}}家</li>
        <li class="list-inline-item">月新增：<br/>{{numInMonth}}家</li>
        <li class="list-inline-item">年新增：<br/>{{numInYear}}家</li>
      </ul>
    </div>
    <div class="card ptb-10 plr-1pc mb-5 text-center">
      <div id="industryClassify" style="width: 95vw; height: 50vh"/>
    </div>
    <div class="card ptb-10 plr-1pc mb-5 text-center">
      <div id="firfightingPoint" style="width: 95vw; height: 50vh"/>
    </div>
  </div>
</template>

<script>
import utils from "../utils"
export default {
  data() {
    return {
      totalNumber: 0,
      numInMonth: 0,
      numInYear: 0,
      numClosed: 0,
      numClsfyType: []
    }
  },
  async created() {
    await this.refresh()
  },
  methods: {
    async refresh() {
      const url = "/population-statistics/api/v1/bdata/companies/total_count"
      const pmss = [
        axios.get(url),
        axios.get(url + "?scope=month"),
        axios.get(url + "?scope=year"),
        axios.get(url + "/is/closed"),
        axios.get(url + "/orderby/type"),
        axios.get(url + "/orderby/firfighting"),
      ]
      const data = await utils.reqBackend(pmss)
      this.totalNumber = data[0][0].cmpNum
      this.numInMonth = data[1][0].cmpNum
      this.numInYear = data[2][0].cmpNum
      this.numClosed = data[3][0].cmpNum
      this.numClsfyType = []
      data[4].map(tpItem => {
        if (!tpItem.type) {
          return
        }
        this.numClsfyType.push({
          value: tpItem.cmpNum,
          name: tpItem.type
        })
      })
      echarts.init(document.getElementById("industryClassify")).setOption(Object.assign(utils.PieModel, {
        title: {
          text: "行业类别",
          left: "right"
        },
        legend: Object.assign(utils.PieModel.legend, {
          left: "left"
        }),
        series: [
          Object.assign(utils.PieModel.series[0], {
            radius: "80%",
            data: this.numClsfyType,
            left: "30%",
            right: 0,
            bottom: "-20%"
          })
        ]
      }))

      // data[5]
      echarts.init(document.getElementById("firfightingPoint")).setOption(Object.assign(utils.BarModel, {
        title: {
          text: "消防重点统计"
        },
        yAxis: {
          data: ["沿街商铺", "店住人", "有仓库", "用明火"]
        },
        series: [
          Object.assign(utils.BarModel.series[0], {
            data: [
              data[5].cmpNumAlgStreet,
              data[5].cmpNumHasLiving,
              data[5].cmpNumHasStore,
              data[5].cmpNumUseFire,
            ],
          })
        ]
      }))
    }
  }
}
</script>

