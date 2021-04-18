<template>
  <div class="ptb-10 plr-1pc scroll-panel" style="top: 49px; bottom: 55px">
    <div class="card ptb-10 plr-5 mb-5">
      <h2 class="text-center mb-0"><b>实有人口：{{numOfPpl}}人</b></h2>
      <hr/>
      <ul class="w-100 mb-0 list-inline d-flex justify-content-around">
        <li class="list-inline-item">周新增：<br/>9999人</li>
        <li class="list-inline-item">月新增：<br/>9999人</li>
        <li class="list-inline-item">年新增：<br/>9999人</li>
      </ul>
    </div>
    <div class="card ptb-10 plr-1pc mb-5 text-center">
      <div id="purposeClassify" style="width: 96vw; height: 50vh"/>
    </div>
    <div class="card ptb-10 plr-1pc mb-5 text-center">
      <div id="nationClassify" style="width: 96vw; height: 40vh"/>
    </div>
    <div class="card ptb-10 plr-1pc mb-5 text-center">
      <div id="ageClassify" style="width: 96vw; height: 40vh"/>
    </div>
    <div class="card ptb-10 plr-1pc mb-5 text-center">
      <div id="specialClassify" style="width: 96vw; height: 40vh"/>
    </div>
    <div class="card ptb-10 plr-1pc mb-5 text-center">
      <div id="infoMissClassify" style="width: 96vw; height: 40vh"/>
    </div>
  </div>
</template>

<script>
import utils from "../utils"
export default {
  data() {
    return {
      numOfPpl: 0
    }
  },
  mounted() {
    echarts.init(document.getElementById("purposeClassify")).setOption(Object.assign(utils.PieModel, {
      title: {text: "来此目的"}, series: [Object.assign(utils.PieModel.series[0], {
        data: [
          {value: 223, name: "半住半工人口"},
          {value: 650, name: "居住人口"},
          {value: 303, name: "就业人口"},
        ]
      })]
    }))
    echarts.init(document.getElementById("nationClassify")).setOption(Object.assign(utils.BarModel, {
      title: {text: "民族分布"},
      yAxis: {
        data: ["境外人员", "维吾尔族", "藏族", "汉族"]
      },
      series: [Object.assign(utils.BarModel.series[0], {
        data: [10, 20, 5, 300]
      })]
    }))
    echarts.init(document.getElementById("ageClassify")).setOption(Object.assign(utils.BarModel, {
      title: {text: "年龄分布"},
      yAxis: {
        data: ["1-18", "18-30", "30-50", "50-70", "70+"]
      },
      series: [Object.assign(utils.BarModel.series[0], {
        data: [10, 40, 53, 32, 8]
      })]
    }))
    echarts.init(document.getElementById("specialClassify")).setOption(Object.assign(utils.BarModel, {
      title: {text: "特殊人群分布"},
      yAxis: {
        data: ["独居老人", "有孕妇", "有精神/心理疾病", "有残疾", "可疑"]
      },
      series: [Object.assign(utils.BarModel.series[0], {
        data: [3, 2, 2, 0, 5]
      })]
    }))
    echarts.init(document.getElementById("infoMissClassify")).setOption(Object.assign(utils.BarModel, {
      title: {text: "信息完整性统计"},
      yAxis: {
        data: ["缺联系方式", "缺户籍地址", "缺居住地址", "缺身份证"]
      },
      series: [Object.assign(utils.BarModel.series[0], {
        data: [2, 183, 102, 1]
      })]
    }))
  },
  created() {
    this.refresh()
  },
  methods: {
    async refresh() {
      const url = "/population-statistics/api/v1/bdata/people/total_count"
      const data = await utils.reqBackend(axios.get(url))
      this.numOfPpl = data[0].pplNum
    }
  }
}
</script>

